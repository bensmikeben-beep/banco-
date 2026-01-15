import React, { useMemo } from 'react';
import { Transaction } from '../types';
import { Search, Download, ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  
  // Group transactions by date
  const groupedTransactions = useMemo(() => {
    const groups: { [key: string]: Transaction[] } = {};
    transactions.forEach(t => {
      const date = new Date(t.date);
      const today = new Date();
      let key = date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });
      
      if (date.toDateString() === today.toDateString()) key = "Hoje";
      
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      if (date.toDateString() === yesterday.toDateString()) key = "Ontem";

      if (!groups[key]) groups[key] = [];
      groups[key].push(t);
    });
    return groups;
  }, [transactions]);

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Extrato</h2>
        <div className="flex gap-2">
           <button className="p-2 bg-white rounded-full text-slate-600 shadow-sm border border-slate-200 hover:bg-slate-50 hover:text-[#820AD1]">
             <Search size={20} />
           </button>
           <button className="p-2 bg-white rounded-full text-slate-600 shadow-sm border border-slate-200 hover:bg-slate-50 hover:text-[#820AD1]">
             <Download size={20} />
           </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden min-h-[500px]">
        {Object.keys(groupedTransactions).length === 0 ? (
          <div className="p-12 text-center text-slate-400">
             Nenhuma transação encontrada.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {Object.entries(groupedTransactions).map(([date, txs]) => (
              <div key={date}>
                <div className="bg-[#F0F1F5] px-6 py-3 border-b border-slate-100 sticky top-0 z-10">
                   <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{date}</span>
                </div>
                <div>
                   {txs.map(t => (
                     <div key={t.id} className={`flex items-center justify-between px-6 py-5 hover:bg-slate-50 transition-colors cursor-pointer ${
                       t.status === 'PENDING' ? 'opacity-80 bg-slate-50/50' : ''
                     }`}>
                        <div className="flex items-center gap-4">
                           <div className={`w-10 h-10 rounded-full flex items-center justify-center relative ${
                             t.amount > 0 ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-600'
                           }`}>
                              {t.status === 'PENDING' && (
                                <div className="absolute -top-1 -right-1 bg-orange-400 text-white rounded-full p-0.5 border-2 border-white shadow-sm">
                                  <Clock size={10} strokeWidth={3} />
                                </div>
                              )}
                              {t.amount > 0 
                                ? <ArrowDownLeft size={18} /> 
                                : <ArrowUpRight size={18} />
                              }
                           </div>
                           <div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-bold text-slate-900">{t.description}</p>
                                {t.status === 'PENDING' && (
                                  <span className="text-[10px] font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full border border-orange-200">
                                    Agendado
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500">{t.merchant || 'Transferência'} • {t.category}</p>
                           </div>
                        </div>
                        <span className={`text-sm font-bold ${
                          t.amount > 0 ? 'text-green-600' : 'text-slate-900'
                        } ${t.status === 'PENDING' ? 'text-slate-400' : ''}`}>
                           {t.amount > 0 ? '+' : ''} R$ {Math.abs(t.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                     </div>
                   ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionList;
