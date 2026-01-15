import React from 'react';
import { 
  LayoutDashboard, 
  List, 
  PieChart, 
  MessageSquareText, 
  CreditCard, 
  Settings, 
  Plus
} from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  setCurrentView: (view: ViewState) => void;
  onNewTransaction: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, onNewTransaction }) => {
  const menuItems: { id: ViewState; label: string; icon: any }[] = [
    { id: 'dashboard', label: 'Início', icon: LayoutDashboard },
    { id: 'transactions', label: 'Movimentações', icon: List },
    { id: 'analysis', label: 'Análise de Gastos', icon: PieChart },
    { id: 'advisor', label: 'Consultor AI', icon: MessageSquareText },
    { id: 'cards', label: 'Meus Cartões', icon: CreditCard },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#820AD1] text-white flex flex-col p-6 z-50 shadow-xl">
      {/* Brand */}
      <div className="mb-10 px-2 flex items-center gap-2">
        <div className="bg-white/20 p-2 rounded-lg">
            <span className="font-bold text-xl tracking-tight">Nu</span>
        </div>
        <span className="font-semibold text-lg opacity-90">NovaBank</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-full transition-all duration-200 group
                ${isActive 
                  ? 'bg-white text-[#820AD1] font-semibold' 
                  : 'text-white/80 hover:bg-[#9c44dc] hover:text-white'
                }`}
            >
              <Icon size={20} className={isActive ? 'text-[#820AD1]' : 'text-white/80'} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="mt-auto pt-6 border-t border-white/20">
         <button 
           onClick={onNewTransaction} 
           className="w-full mb-4 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full font-semibold transition flex items-center justify-center gap-2"
         >
            <Plus size={18} /> Nova Ação
         </button>
         <button 
           onClick={() => setCurrentView('settings')}
           className={`flex items-center space-x-3 text-white/70 hover:text-white px-4 transition py-2 w-full rounded-full
             ${currentView === 'settings' ? 'bg-[#9c44dc] text-white' : ''}`}
         >
            <Settings size={20} />
            <span className="text-sm">Configurar</span>
         </button>
      </div>
    </aside>
  );
};

export default Sidebar;
