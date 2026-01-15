import React, { useState } from 'react';
import { Shield, Smartphone, Globe, ChevronRight, Check, Loader2, CreditCard, Building2 } from 'lucide-react';

const SettingsView: React.FC = () => {
  const [openFinanceConnected, setOpenFinanceConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);

  const handleConnectOpenFinance = () => {
    setConnecting(true);
    // Simula chamada de API para Open Finance
    setTimeout(() => {
      setOpenFinanceConnected(true);
      setConnecting(false);
    }, 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-10">
      <header>
        <h2 className="text-2xl font-bold text-slate-800">Configurações</h2>
        <p className="text-slate-500">Gerencie sua conta, segurança e Open Finance.</p>
      </header>

      {/* Seção Open Finance */}
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
        <div className="flex items-start gap-4">
           <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
             <Globe size={24} />
           </div>
           <div className="flex-1">
             <h3 className="text-lg font-bold text-slate-800">Open Finance</h3>
             <p className="text-slate-500 text-sm mt-1 mb-4">
               Traga seus dados de outros bancos para o NovaBank. Nossa IA analisará tudo em um só lugar.
             </p>
             
             {!openFinanceConnected ? (
               <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                  <h4 className="font-bold text-slate-700 mb-4">Conectar Instituição</h4>
                  <div className="flex gap-4 overflow-x-auto pb-2 mb-4">
                     {['Banco do Brasil', 'Itaú', 'Bradesco', 'Santander'].map(bank => (
                       <button key={bank} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-medium hover:border-[#820AD1] hover:text-[#820AD1] transition-colors whitespace-nowrap">
                          <Building2 size={16} /> {bank}
                       </button>
                     ))}
                  </div>
                  <button 
                    onClick={handleConnectOpenFinance}
                    disabled={connecting}
                    className="flex items-center gap-2 bg-[#820AD1] text-white px-6 py-3 rounded-full font-bold hover:bg-[#6e05b5] transition-all disabled:opacity-70"
                  >
                    {connecting ? <Loader2 className="animate-spin" size={20} /> : 'Conectar Contas'}
                  </button>
               </div>
             ) : (
               <div className="bg-green-50 rounded-2xl p-4 border border-green-100 flex items-center gap-3">
                 <div className="w-8 h-8 bg-green-200 text-green-700 rounded-full flex items-center justify-center">
                   <Check size={16} strokeWidth={3} />
                 </div>
                 <div>
                   <p className="font-bold text-green-800">Contas Conectadas</p>
                   <p className="text-xs text-green-600">Seus dados estão sincronizados automaticamente.</p>
                 </div>
               </div>
             )}
           </div>
        </div>
      </div>

      {/* Segurança */}
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
           <Shield className="text-[#820AD1]" />
           <h3 className="text-lg font-bold text-slate-800">Segurança</h3>
        </div>
        
        <div className="space-y-4">
           <div className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl cursor-pointer transition">
              <div className="flex items-center gap-4">
                 <Smartphone className="text-slate-400" />
                 <div>
                    <p className="font-bold text-slate-700">Modo Rua</p>
                    <p className="text-xs text-slate-500">Limite transações fora de casa</p>
                 </div>
              </div>
              <div className="flex items-center gap-2 text-green-600 text-sm font-bold">
                 Ativo <ChevronRight size={16} />
              </div>
           </div>
           
           <div className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl cursor-pointer transition">
              <div className="flex items-center gap-4">
                 <CreditCard className="text-slate-400" />
                 <div>
                    <p className="font-bold text-slate-700">Configurar Cartões</p>
                    <p className="text-xs text-slate-500">Ajuste limites e bloqueios</p>
                 </div>
              </div>
              <ChevronRight size={16} className="text-slate-400" />
           </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
