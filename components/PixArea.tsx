import React, { useState } from 'react';
import { ArrowLeft, QrCode, Copy, Send, Check, X, Loader2, CreditCard, Building2, CalendarClock, History, ArrowRight } from 'lucide-react';
import { Transaction, PixReceiver, TransactionType, TransactionCategory } from '../types';

interface Props {
  balance: number;
  onBack: () => void;
  onTransfer: (amount: number, receiver: string) => void;
}

const MOCK_SCHEDULED_PIX = [
    { id: 1, name: 'Netflix assinatura', date: '05 FEV', amount: 55.90 },
    { id: 2, name: 'Condomínio', date: '10 FEV', amount: 450.00 },
];

export default function PixArea({ balance, onBack, onTransfer }: Props) {
  const [step, setStep] = useState<'home' | 'send' | 'receive' | 'confirm' | 'scheduled'>('home');
  const [amount, setAmount] = useState('');
  const [receiver, setReceiver] = useState<PixReceiver | null>(null);
  const [pixKey, setPixKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Helper to format currency
  const formatBRL = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const fetchPixData = (key: string) => {
    setLoading(true);
    // Simula API do DICT
    setTimeout(() => {
        setReceiver({
            name: 'MARIANA SILVA COSTA',
            bank: 'Banco Inter',
            cpfMasked: '***.432.111-**'
        });
        setLoading(false);
        setStep('confirm');
    }, 1500);
  };

  const handleConfirm = () => {
     if(!amount || !receiver) return;
     const val = parseFloat(amount.replace(/\./g, '').replace(',', '.'));
     setLoading(true);
     setTimeout(() => {
         onTransfer(val, receiver.name);
         setSuccess(true);
         setLoading(false);
     }, 2000);
  };

  const handleAmountChange = (e: any) => {
    let val = e.target.value.replace(/\D/g, '');
    if (!val) { setAmount(''); return; }
    const numberVal = parseFloat(val) / 100;
    setAmount(numberVal.toLocaleString('pt-BR', { minimumFractionDigits: 2 }));
  };

  if (success) {
      return (
        <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto animate-fade-in text-center p-6">
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
                <Check size={48} strokeWidth={3} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Pix Enviado!</h2>
            <p className="text-slate-500 mb-8">Você transferiu <strong className="text-slate-800">R$ {amount}</strong> para <strong className="text-slate-800">{receiver?.name}</strong>.</p>
            <button onClick={() => { setSuccess(false); setStep('home'); setAmount(''); setPixKey(''); setReceiver(null); }} className="w-full bg-[#820AD1] text-white py-4 rounded-full font-bold shadow-lg shadow-purple-200">
                Fazer outro Pix
            </button>
            <button onClick={onBack} className="mt-4 text-slate-500 font-bold text-sm">Voltar ao Início</button>
        </div>
      )
  }

  return (
    <div className="bg-white min-h-[calc(100vh-140px)] rounded-[32px] shadow-sm border border-slate-100 overflow-hidden flex flex-col animate-fade-in max-w-4xl mx-auto relative">
      
      {/* Header */}
      <div className="p-6 border-b border-slate-100 flex items-center gap-4 sticky top-0 bg-white z-10">
        <button onClick={step === 'home' ? onBack : () => setStep('home')} className="p-2 -ml-2 hover:bg-slate-50 rounded-full text-slate-600 transition">
            <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl font-bold text-slate-800">Área Pix</h2>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        
        {step === 'home' && (
            <div className="space-y-8">
                {/* Ações Principais */}
                <div className="grid grid-cols-2 gap-4">
                    <button 
                        onClick={() => setStep('send')}
                        className="flex flex-col items-center justify-center gap-3 bg-[#820AD1] text-white p-6 rounded-3xl shadow-lg shadow-purple-200 hover:bg-[#6e05b5] transition-all group"
                    >
                        <div className="p-3 bg-white/20 rounded-full group-hover:scale-110 transition">
                            <Send size={24} />
                        </div>
                        <span className="font-bold">Enviar</span>
                    </button>
                    <button 
                         onClick={() => setStep('receive')}
                         className="flex flex-col items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 p-6 rounded-3xl hover:bg-slate-50 transition-all group"
                    >
                        <div className="p-3 bg-slate-100 rounded-full group-hover:bg-[#820AD1] group-hover:text-white transition-colors">
                            <QrCode size={24} />
                        </div>
                        <span className="font-bold">Receber</span>
                    </button>
                </div>

                {/* Opções Secundárias */}
                <div className="grid grid-cols-4 gap-2">
                    {[
                        { icon: Copy, label: 'Copia e Cola', action: () => setStep('send') },
                        { icon: Building2, label: 'Chaves', action: () => {} },
                        { icon: CalendarClock, label: 'Agendados', action: () => setStep('scheduled') },
                        { icon: History, label: 'Extrato', action: () => {} },
                    ].map((item, i) => (
                        <button key={i} onClick={item.action} className="flex flex-col items-center gap-2 p-3 hover:bg-slate-50 rounded-2xl transition">
                            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-700">
                                <item.icon size={20} />
                            </div>
                            <span className="text-xs font-bold text-slate-600 text-center leading-tight">{item.label}</span>
                        </button>
                    ))}
                </div>

                {/* Pix Automático (Trend 2026) */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl p-6 border border-emerald-100 flex items-center gap-4 cursor-pointer hover:shadow-md transition">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-emerald-600 shadow-sm">
                        <CalendarClock size={24} />
                    </div>
                    <div className="flex-1">
                         <h3 className="font-bold text-emerald-900">Pix Automático</h3>
                         <p className="text-sm text-emerald-700 leading-tight mt-1">Gerencie pagamentos recorrentes como luz, água e streaming.</p>
                    </div>
                    <ArrowRight size={20} className="text-emerald-400" />
                </div>
            </div>
        )}

        {step === 'send' && (
            <div className="max-w-md mx-auto animate-fade-in space-y-6">
                <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Qual a chave Pix?</h3>
                    <p className="text-slate-500 mb-6">Insira CPF, e-mail, telefone ou chave aleatória.</p>
                    <div className="relative">
                        <input 
                           autoFocus
                           value={pixKey}
                           onChange={(e) => setPixKey(e.target.value)}
                           className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 pl-4 pr-12 text-lg font-medium focus:border-[#820AD1] outline-none transition"
                           placeholder="Chave Pix"
                        />
                        {loading && <div className="absolute right-4 top-4"><Loader2 className="animate-spin text-[#820AD1]" /></div>}
                    </div>
                </div>

                <div className="flex gap-3 overflow-x-auto pb-2">
                    <button onClick={() => { setPixKey('123.456.789-00'); fetchPixData('mock'); }} className="whitespace-nowrap px-4 py-2 bg-slate-100 rounded-full text-sm font-bold text-slate-600 hover:bg-slate-200">
                        CPF Mock
                    </button>
                    <button onClick={() => { setPixKey('email@teste.com'); fetchPixData('mock'); }} className="whitespace-nowrap px-4 py-2 bg-slate-100 rounded-full text-sm font-bold text-slate-600 hover:bg-slate-200">
                        E-mail Mock
                    </button>
                </div>
                
                <button 
                    onClick={() => fetchPixData(pixKey)}
                    disabled={!pixKey || loading}
                    className="w-full bg-[#820AD1] text-white py-4 rounded-full font-bold shadow-lg shadow-purple-200 disabled:opacity-50 disabled:shadow-none transition-all"
                >
                    Continuar
                </button>
            </div>
        )}

        {step === 'confirm' && receiver && (
             <div className="max-w-md mx-auto animate-fade-in flex flex-col h-full">
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 mb-6 text-center">
                    <div className="w-16 h-16 bg-white rounded-full mx-auto flex items-center justify-center text-slate-400 shadow-sm mb-3 font-bold text-xl border border-slate-100">
                        {receiver.name.charAt(0)}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">{receiver.name}</h3>
                    <p className="text-slate-500 text-sm mt-1">{receiver.cpfMasked} • {receiver.bank}</p>
                </div>

                <div className="mb-8">
                     <label className="text-sm font-bold text-slate-500 ml-1">Valor a pagar</label>
                     <div className="flex items-center gap-1 mt-2">
                        <span className="text-slate-400 text-2xl">R$</span>
                        <input 
                            value={amount}
                            onChange={handleAmountChange}
                            placeholder="0,00"
                            className="text-5xl font-bold text-slate-900 outline-none w-full placeholder:text-slate-200 bg-transparent tracking-tight"
                            autoFocus
                        />
                     </div>
                     <p className="text-sm text-slate-400 mt-4">Saldo disponível: <span className="text-slate-700 font-bold">{formatBRL(balance)}</span></p>
                </div>

                <button 
                    onClick={handleConfirm}
                    disabled={!amount || loading}
                    className="mt-auto w-full bg-[#820AD1] text-white py-4 rounded-full font-bold text-lg shadow-lg shadow-purple-200 flex items-center justify-center gap-2"
                >
                    {loading ? <Loader2 className="animate-spin" /> : 'Transferir Agora'}
                </button>
             </div>
        )}

        {step === 'receive' && (
             <div className="max-w-md mx-auto animate-fade-in text-center space-y-6 pt-4">
                 <div className="bg-white p-6 rounded-3xl border-2 border-[#820AD1] inline-block shadow-lg shadow-purple-100">
                    <QrCode size={180} className="text-[#820AD1]" />
                 </div>
                 <div>
                    <h3 className="text-xl font-bold text-slate-900">Cobrar via QR Code</h3>
                    <p className="text-slate-500 mt-2 text-sm">Qualquer pessoa pode escanear para te pagar.</p>
                 </div>
                 
                 <div className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between gap-4 border border-slate-200">
                    <span className="font-mono text-sm text-slate-600 truncate">00020126580014BR.GOV.BCB.PIX...</span>
                    <button className="text-[#820AD1] font-bold text-sm hover:underline">Copiar</button>
                 </div>
                 
                 <button className="w-full text-slate-600 font-bold py-3 hover:bg-slate-50 rounded-full transition">
                    Configurar valor (opcional)
                 </button>
             </div>
        )}

        {step === 'scheduled' && (
            <div className="animate-fade-in space-y-6">
                 <h3 className="font-bold text-slate-900 text-lg">Próximos Agendamentos</h3>
                 {MOCK_SCHEDULED_PIX.map(item => (
                     <div key={item.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition">
                         <div className="flex items-center gap-4">
                             <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-xs flex-col leading-none">
                                 <span>{item.date.split(' ')[0]}</span>
                                 <span className="text-[9px]">{item.date.split(' ')[1]}</span>
                             </div>
                             <div>
                                 <p className="font-bold text-slate-800">{item.name}</p>
                                 <p className="text-xs text-slate-500">Pix Automático</p>
                             </div>
                         </div>
                         <span className="font-bold text-slate-900">{formatBRL(item.amount)}</span>
                     </div>
                 ))}
                 <button className="w-full py-4 border border-dashed border-slate-300 rounded-2xl text-slate-500 font-bold hover:bg-slate-50 hover:border-[#820AD1] hover:text-[#820AD1] transition">
                     + Agendar novo Pix
                 </button>
            </div>
        )}

      </div>
    </div>
  );
}