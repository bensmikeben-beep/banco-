import React, { useState } from 'react';
import { CreditCard, Shield, Wifi, Eye, EyeOff, Lock, Unlock, Smartphone, BrainCircuit, Sparkles, MoreHorizontal } from 'lucide-react';
import { AccountSummary } from '../types';

interface CardsViewProps {
  summary: AccountSummary;
}

const CardsView: React.FC<CardsViewProps> = ({ summary }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const progress = (summary.creditUsed / summary.creditLimit) * 100;
  const available = summary.creditLimit - summary.creditUsed;

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto pb-10">
      <header className="flex justify-between items-end">
        <div>
           <h2 className="text-3xl font-bold text-slate-900">Meus Cartões</h2>
           <p className="text-slate-500 mt-1">Gerencie seu cartão físico e virtual.</p>
        </div>
        <button className="bg-[#820AD1] text-white px-6 py-3 rounded-full font-bold text-sm shadow-lg shadow-purple-200 hover:bg-[#6e05b5] transition-all">
           + Criar Cartão Virtual
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Lado Esquerdo: Cartão Interativo */}
        <div className="space-y-8 perspective-1000">
           
           {/* Cartão Flipável */}
           <div 
              className={`relative w-full aspect-[1.586] cursor-pointer transition-all duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}
              onClick={() => setIsFlipped(!isFlipped)}
           >
              {/* FRENTE */}
              <div className="absolute inset-0 w-full h-full bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl shadow-slate-900/40 backface-hidden overflow-hidden flex flex-col justify-between">
                  {/* Background Abstract */}
                  <div className="absolute top-0 right-0 w-full h-full opacity-30 pointer-events-none">
                     <div className="absolute top-[-50%] right-[-50%] w-full h-full rounded-full bg-gradient-to-br from-indigo-500 to-transparent blur-[80px]"></div>
                     <div className="absolute bottom-[-50%] left-[-20%] w-full h-full rounded-full bg-gradient-to-tr from-violet-600 to-transparent blur-[60px]"></div>
                  </div>

                  <div className="relative z-10 flex justify-between items-start">
                      <div className="flex items-center gap-3">
                         <div className="w-12 h-9 bg-gradient-to-tr from-[#fbbf24] to-[#d97706] rounded-md opacity-90 shadow-sm border border-white/10"></div>
                         <Wifi className="rotate-90 text-white/70" size={20} />
                      </div>
                      <div className="font-bold tracking-widest text-lg italic opacity-90">NovaBank</div>
                  </div>

                  <div className="relative z-10 space-y-6">
                      <div className="flex items-center gap-4 text-2xl tracking-[0.15em] font-mono text-white/90 drop-shadow-md">
                          <span>••••</span>
                          <span>••••</span>
                          <span>••••</span>
                          <span>8829</span>
                      </div>
                      <div className="flex justify-between items-end">
                          <div>
                              <p className="text-[9px] uppercase tracking-widest opacity-60 mb-1">Titular</p>
                              <p className="font-medium tracking-wide text-sm">BENS CLIENTE</p>
                          </div>
                          <div className="text-right">
                              <p className="text-[9px] uppercase tracking-widest opacity-60 mb-1">Validade</p>
                              <p className="font-medium text-sm">12/30</p>
                          </div>
                      </div>
                  </div>
                  {isLocked && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center text-white/90">
                        <Lock size={48} className="mb-2" />
                        <span className="font-bold uppercase tracking-widest text-sm">Bloqueado</span>
                    </div>
                  )}
              </div>

              {/* VERSO */}
              <div className="absolute inset-0 w-full h-full bg-slate-800 rounded-[2rem] text-white shadow-2xl backface-hidden rotate-y-180 overflow-hidden">
                  <div className="w-full h-12 bg-black mt-8"></div>
                  <div className="p-8 mt-2">
                      <div className="flex items-center gap-4">
                          <div className="flex-1 h-10 bg-white/10 rounded-md flex items-center justify-end px-3">
                              <span className="font-mono text-sm opacity-60 italic">Assinatura autorizada</span>
                          </div>
                          <div className="w-16 h-10 bg-white text-slate-900 font-bold font-mono flex items-center justify-center rounded-md border-2 border-red-500">
                             123
                          </div>
                      </div>
                      <div className="mt-8 text-[10px] text-white/40 text-justify leading-relaxed">
                          Este cartão é propriedade do NovaBank. O uso deste cartão é regido pelos termos do contrato do titular. Encontrou? Devolva em qualquer agência ou ligue 0800 000 0000.
                      </div>
                  </div>
              </div>
           </div>

           <p className="text-center text-sm text-slate-400 font-medium flex items-center justify-center gap-2">
              <Eye size={14} /> Clique no cartão para ver o código de segurança
           </p>

           {/* Ações */}
           <div className="grid grid-cols-4 gap-4">
              <button 
                onClick={() => setIsLocked(!isLocked)}
                className={`flex flex-col items-center gap-3 p-4 rounded-2xl transition-all duration-300 group
                  ${isLocked ? 'bg-red-50 text-red-600' : 'bg-white hover:bg-slate-50 text-slate-600 shadow-sm border border-slate-100 hover:shadow-md'}`}
              >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors
                     ${isLocked ? 'bg-red-100 text-red-600' : 'bg-slate-100 group-hover:bg-[#820AD1] group-hover:text-white'}`}>
                      {isLocked ? <Lock size={20} /> : <Unlock size={20} />}
                  </div>
                  <span className="text-xs font-bold">{isLocked ? 'Desbloquear' : 'Bloquear'}</span>
              </button>

              <button className="flex flex-col items-center gap-3 p-4 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:bg-slate-50 transition-all duration-300 group text-slate-600">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-[#820AD1] group-hover:text-white transition-colors">
                      <Smartphone size={20} />
                  </div>
                  <span className="text-xs font-bold">Carteira</span>
              </button>

              <button className="flex flex-col items-center gap-3 p-4 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:bg-slate-50 transition-all duration-300 group text-slate-600">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-[#820AD1] group-hover:text-white transition-colors">
                      <Shield size={20} />
                  </div>
                  <span className="text-xs font-bold">Seguro</span>
              </button>

              <button className="flex flex-col items-center gap-3 p-4 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:bg-slate-50 transition-all duration-300 group text-slate-600">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-[#820AD1] group-hover:text-white transition-colors">
                      <MoreHorizontal size={20} />
                  </div>
                  <span className="text-xs font-bold">Configurar</span>
              </button>
           </div>
        </div>

        {/* Lado Direito: Limites e IA */}
        <div className="space-y-6">
            
            {/* Box de Limite */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-xl font-bold text-slate-800">Limite de Crédito</h3>
                   <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">Bom Pagador</span>
                </div>

                <div className="relative pt-6 pb-2">
                    <div className="flex justify-between text-sm font-bold mb-3">
                        <span className="text-slate-500">Gasto Atual</span>
                        <span className="text-slate-900">R$ {summary.creditUsed.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
                    </div>
                    
                    {/* Barra de Progresso */}
                    <div className="w-full bg-slate-100 h-6 rounded-full overflow-hidden relative">
                        {/* Marcadores */}
                        <div className="absolute top-0 bottom-0 w-[1px] bg-white z-10 left-[25%] opacity-50"></div>
                        <div className="absolute top-0 bottom-0 w-[1px] bg-white z-10 left-[50%] opacity-50"></div>
                        <div className="absolute top-0 bottom-0 w-[1px] bg-white z-10 left-[75%] opacity-50"></div>
                        
                        <div 
                           className={`h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden
                           ${progress > 80 ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gradient-to-r from-[#820AD1] to-violet-500'}`} 
                           style={{ width: `${progress}%` }}
                        >
                           <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.15)_50%,rgba(255,255,255,.15)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] animate-[progress_1s_linear_infinite]"></div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                        <div className="text-xs text-slate-400 font-medium">
                            Disponível: <span className="text-green-600 font-bold">R$ {available.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
                        </div>
                        <div className="text-xs text-slate-400 font-medium">
                            Total: R$ {summary.creditLimit.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 flex gap-4">
                    <button className="flex-1 bg-slate-50 text-slate-700 py-3 rounded-xl font-bold text-sm hover:bg-slate-100 transition">
                       Ajustar Limite
                    </button>
                    <button className="flex-1 bg-slate-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition shadow-lg shadow-slate-200">
                       Pagar Fatura
                    </button>
                </div>
            </div>

            {/* AI Insight Card */}
            <div className="bg-gradient-to-br from-[#F5F3FF] to-[#EDE9FE] rounded-[2rem] p-8 border border-[#820AD1]/10 relative overflow-hidden">
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#820AD1]/10 rounded-full blur-2xl"></div>
                
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-[#820AD1]">
                        <BrainCircuit size={20} />
                    </div>
                    <h3 className="font-bold text-[#820AD1]">Análise Inteligente</h3>
                </div>
                
                <p className="text-slate-700 text-sm leading-relaxed mb-6">
                    Notei que você utilizou <strong className="text-[#820AD1]">{progress.toFixed(0)}%</strong> do seu limite este mês, principalmente em <strong>Restaurantes</strong>. 
                    <br/><br/>
                    Quer parcelar a compra no <em>Coco Bambu</em> (R$ 340,00) em até 12x para aliviar sua fatura?
                </p>

                <button className="w-full bg-white text-[#820AD1] py-3 rounded-xl font-bold text-sm hover:bg-white/80 transition flex items-center justify-center gap-2 shadow-sm">
                   <Sparkles size={16} /> Ver Simulação de Parcelamento
                </button>
            </div>

        </div>
      </div>
    </div>
  );
};

export default CardsView;