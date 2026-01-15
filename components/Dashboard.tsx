import React, { useState } from 'react';
import { AccountSummary, Transaction } from '../types';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  CreditCard, 
  QrCode, 
  Smartphone, 
  Eye,
  EyeOff,
  Barcode,
  PieChart
} from 'lucide-react';

interface DashboardProps {
  summary: AccountSummary;
  recentTransactions: Transaction[];
  onQuickAction: (action: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ summary, recentTransactions, onQuickAction }) => {
  const [showBalance, setShowBalance] = useState(true);

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl">
      
      {/* Header with Welcome & Eye Toggle */}
      <header className="flex justify-between items-center mb-2">
        <div>
           <h1 className="text-2xl font-semibold text-slate-800">Olá, Usuário</h1>
        </div>
        <div className="flex gap-4">
             <button 
               onClick={() => setShowBalance(!showBalance)} 
               className="p-2 bg-white rounded-full hover:bg-slate-100 transition text-[#820AD1] shadow-sm border border-slate-100"
             >
                {showBalance ? <Eye size={20} /> : <EyeOff size={20} className="text-slate-400"/>}
             </button>
        </div>
      </header>

      {/* Main Account Card */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
        <div className="flex justify-between items-start mb-6 relative z-10">
           <h2 className="text-lg font-medium text-slate-700">Conta</h2>
           <ArrowUpRight size={20} className="text-slate-400"/>
        </div>
        
        <div className="mb-8 relative z-10">
            <span className="text-sm text-slate-500 font-medium">Saldo disponível</span>
            <div className="text-3xl font-bold text-slate-900 mt-1 tracking-tight">
                {showBalance ? `R$ ${summary.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '••••••••'}
            </div>
            
            {/* Pending Balance Indicator */}
            {summary.pendingBalance > 0 && showBalance && (
                <div className="mt-3 text-sm text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg inline-flex items-center gap-2 font-medium">
                   <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                   + R$ {summary.pendingBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} a entrar (Pendentes)
                </div>
            )}
        </div>

        {/* Quick Actions Strip */}
        <div className="flex gap-6 overflow-x-auto pb-2 custom-scrollbar relative z-10">
           <QuickActionButton icon={QrCode} label="Área Pix" onClick={() => onQuickAction('pix')} />
           <QuickActionButton icon={Barcode} label="Pagar" onClick={() => onQuickAction('pay')} />
           <QuickActionButton icon={ArrowDownLeft} label="Transferir" onClick={() => onQuickAction('transfer')} />
           <QuickActionButton icon={Smartphone} label="Recarga" onClick={() => onQuickAction('generic')} />
           <QuickActionButton icon={PieChart} label="Investir" onClick={() => {}} />
        </div>
      </div>

      {/* Secondary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         
         {/* Credit Card Box */}
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-full min-h-[200px]">
            <div>
               <CreditCard size={24} className="text-slate-700 mb-4"/>
               <h3 className="text-lg font-medium text-slate-700 mb-2">Cartão de Crédito</h3>
               <span className="text-sm text-slate-500 block font-medium">Fatura atual</span>
               <div className="text-2xl font-bold text-blue-500 mt-1">
                  R$ {showBalance ? summary.expenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 }).replace('-', '') : '••••'}
               </div>
               <span className="text-xs text-slate-400 mt-2 block">Limite disponível: R$ {(summary.creditLimit - summary.creditUsed).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
         </div>
         
         {/* Recent History Box */}
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
             <div className="flex justify-between items-center mb-6">
                 <h3 className="text-lg font-medium text-slate-700">Histórico Recente</h3>
                 <button className="text-[#820AD1] text-sm font-bold hover:underline">Ver tudo</button>
             </div>
             
             <div className="space-y-4">
                 {recentTransactions.slice(0, 4).map((tx: Transaction) => (
                     <div key={tx.id} className="flex items-center justify-between pb-3 border-b border-slate-50 last:border-0 last:pb-0 group hover:bg-slate-50/50 p-2 rounded-lg transition-colors cursor-pointer">
                         <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-full ${tx.amount > 0 ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-600'}`}>
                                {tx.amount > 0 ? <ArrowDownLeft size={18}/> : <ArrowUpRight size={18}/>}
                            </div>
                            <div>
                                <p className="font-semibold text-slate-800 text-sm">{tx.merchant || tx.description}</p>
                                <div className="flex gap-2 text-xs">
                                  <span className="text-slate-400">{tx.category}</span>
                                  {tx.status === 'PENDING' && (
                                    <span className="text-orange-500 font-bold bg-orange-50 px-1 rounded">Pendente</span>
                                  )}
                                </div>
                            </div>
                         </div>
                         <span className={`font-semibold text-sm ${tx.amount > 0 ? 'text-green-600' : 'text-slate-900'} ${tx.status === 'PENDING' ? 'opacity-50' : ''}`}>
                             {showBalance ? (
                               <>
                                {tx.amount > 0 ? '+' : ''} R$ {Math.abs(tx.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                               </>
                             ) : '•••'}
                         </span>
                     </div>
                 ))}
             </div>
         </div>
      </div>
    </div>
  );
};

const QuickActionButton = ({ icon: Icon, label, onClick }: { icon: any, label: string, onClick: () => void }) => (
    <button 
      onClick={onClick} 
      className="flex flex-col items-center gap-3 group min-w-[80px]"
    >
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-800 transition-all duration-300 group-hover:bg-[#820AD1] group-hover:text-white group-hover:shadow-lg group-active:scale-95">
            <Icon size={24} strokeWidth={1.5} />
        </div>
        <span className="text-sm font-semibold text-slate-700 text-center group-hover:text-[#820AD1] transition-colors">{label}</span>
    </button>
);

export default Dashboard;
