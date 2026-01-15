import React, { useState, useEffect } from 'react';
import { TransactionType, TransactionCategory } from '../types';
import { categorizeTransactionAI } from '../services/geminiService';
import { X, Sparkles, Loader2, CheckCircle2, QrCode, ArrowRight, Building2, FileText, DollarSign, ChevronLeft } from 'lucide-react';

interface NewTransactionModalProps {
  isOpen: boolean;
  initialMode: 'generic' | 'pix' | 'transfer' | 'pay' | 'deposit';
  onClose: () => void;
  onSave: (transaction: any) => void;
}

type Step = 'input' | 'review' | 'processing' | 'success';

const NewTransactionModal: React.FC<NewTransactionModalProps> = ({ isOpen, initialMode, onClose, onSave }) => {
  const [step, setStep] = useState<Step>('input');
  
  // Form State
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<string>(TransactionCategory.OTHER);
  const [destination, setDestination] = useState('');
  
  // Loading States
  const [isCategorizing, setIsCategorizing] = useState(false);

  const getTitle = () => {
    switch(initialMode) {
      case 'pix': return 'Área Pix';
      case 'transfer': return 'Transferir';
      case 'pay': return 'Pagar Boleto';
      case 'deposit': return 'Depositar';
      default: return 'Nova Transação';
    }
  };

  const getType = (): TransactionType => {
    if (initialMode === 'deposit') return TransactionType.DEPOSIT;
    if (initialMode === 'transfer' || initialMode === 'pix') return TransactionType.TRANSFER;
    if (initialMode === 'pay') return TransactionType.PAYMENT;
    return TransactionType.PAYMENT; 
  };

  useEffect(() => {
    if (isOpen) {
      setStep('input');
      setDescription('');
      setAmount('');
      setDestination('');
      setCategory(initialMode === 'pay' ? TransactionCategory.UTILITIES : TransactionCategory.OTHER);
    }
  }, [isOpen, initialMode]);

  const handleAutoCategorize = async () => {
    if (!description || !amount) return;
    setIsCategorizing(true);
    try {
      const suggestedCategory = await categorizeTransactionAI(description, parseFloat(amount));
      const match = Object.values(TransactionCategory).find(c => c.toLowerCase() === suggestedCategory.toLowerCase());
      if (match) setCategory(match);
    } catch (e) {
      console.error(e);
    } finally {
      setIsCategorizing(false);
    }
  };

  const goToReview = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('review');
  };

  const confirmTransaction = async () => {
    setStep('processing');
    await new Promise(resolve => setTimeout(resolve, 2000)); // Dramatic bank pause

    const val = parseFloat(amount);
    const type = getType();
    const finalAmount = type === TransactionType.DEPOSIT ? Math.abs(val) : -Math.abs(val);

    let finalDesc = description;
    if (!finalDesc) {
        if (initialMode === 'pix') finalDesc = `Pix para ${destination}`;
        else if (initialMode === 'pay') finalDesc = `Boleto Bancário`;
        else finalDesc = getTitle();
    }

    onSave({
      description: finalDesc,
      amount: finalAmount,
      date: new Date().toISOString().split('T')[0],
      type,
      category: category as TransactionCategory,
      merchant: destination || 'Banco'
    });

    setStep('success');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      <div className="bg-white rounded-[2rem] w-full max-w-md relative shadow-2xl scale-100 transition-all animate-fade-in overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className={`p-6 pb-2 flex justify-between items-center bg-white z-10`}>
          <div className="flex items-center gap-3">
             {step === 'review' && (
               <button onClick={() => setStep('input')} className="text-slate-400 hover:text-slate-600">
                 <ChevronLeft size={24} />
               </button>
             )}
             <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                {step === 'success' ? '' : getTitle()}
             </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-slate-50 p-2 rounded-full">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 pt-2 flex-1 overflow-y-auto">
          
          {step === 'input' && (
            <form onSubmit={goToReview} className="space-y-6">
              
              {/* Dynamic Inputs */}
              <div className="space-y-4">
                 {initialMode === 'pix' && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Qual é a chave Pix?</label>
                    <input
                      type="text"
                      required
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-medium text-lg"
                      placeholder="CPF, CNPJ, Email ou Celular"
                    />
                  </div>
                )}
                
                {initialMode === 'pay' && (
                   <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Linha digitável</label>
                    <input
                      type="text"
                      required
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-indigo-500 font-mono text-sm"
                      placeholder="0000.0000..."
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Qual é o valor?</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">R$</span>
                    <input
                      type="number"
                      required
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-3xl font-bold text-slate-900"
                      placeholder="0,00"
                    />
                  </div>
                </div>

                {/* Optional description */}
                 <div>
                    <div className="flex justify-between mb-2">
                        <label className="text-sm font-semibold text-slate-700">Descrição (Opcional)</label>
                        <button 
                            type="button" 
                            onClick={handleAutoCategorize} 
                            disabled={!amount || isCategorizing}
                            className="text-xs text-indigo-600 font-bold flex items-center gap-1 hover:underline disabled:opacity-50"
                        >
                            <Sparkles size={12} />
                            {isCategorizing ? 'IA Analisando...' : 'Sugerir Categoria'}
                        </button>
                    </div>
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-indigo-500"
                      placeholder="Escreva uma mensagem..."
                    />
                 </div>
              </div>
              
              <div className="pt-4">
                 <button
                  type="submit"
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-full shadow-lg shadow-indigo-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <ArrowRight size={24} />
                </button>
              </div>
            </form>
          )}

          {step === 'review' && (
             <div className="space-y-6 animate-fade-in">
                <div className="text-center">
                   <p className="text-slate-500 font-medium">Você está transferindo</p>
                   <h3 className="text-4xl font-bold text-slate-900 mt-2">R$ {parseFloat(amount).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</h3>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6 space-y-4 border border-slate-100">
                    <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                        <span className="text-slate-500 text-sm">Para</span>
                        <span className="font-bold text-slate-800 text-right">{destination || "Conta NovaBank"}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                        <span className="text-slate-500 text-sm">Quando</span>
                        <span className="font-bold text-slate-800">Agora</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-slate-500 text-sm">Categoria</span>
                        <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg text-sm">{category}</span>
                    </div>
                </div>

                <button
                  onClick={confirmTransaction}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-full shadow-lg shadow-indigo-500/30 transition-all active:scale-[0.98]"
                >
                  Confirmar Transferência
                </button>
             </div>
          )}

          {step === 'processing' && (
            <div className="h-64 flex flex-col items-center justify-center text-center space-y-6">
               <Loader2 className="animate-spin text-indigo-600" size={48} />
               <h3 className="text-xl font-bold text-slate-800">Realizando transferência...</h3>
            </div>
          )}

          {step === 'success' && (
            <div className="flex flex-col items-center justify-center text-center space-y-6 animate-fade-in py-4">
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
                <CheckCircle2 size={48} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Pronto!</h3>
                <p className="text-slate-500 text-lg">
                  Sua transação de <strong className="text-slate-900">R$ {parseFloat(amount).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</strong> foi realizada com sucesso.
                </p>
              </div>
              <div className="w-full pt-4 space-y-3">
                <button className="w-full py-4 bg-slate-100 text-slate-700 font-bold rounded-full hover:bg-slate-200 transition-colors">
                    Ver Comprovante
                </button>
                <button 
                    onClick={onClose}
                    className="w-full py-4 text-indigo-600 font-bold rounded-full hover:bg-indigo-50 transition-colors"
                >
                    Fechar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewTransactionModal;
