import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, List, PieChart, MessageSquareText, CreditCard, 
  Settings, Plus, Eye, EyeOff, ArrowUpRight, ArrowDownLeft, QrCode, 
  Smartphone, Barcode, Copy, ChevronRight, Lock, LogIn, User, Check, 
  AlertCircle, X, Loader2, ShieldCheck, Camera, Upload, ScanFace, FileText,
  BrainCircuit
} from 'lucide-react';
import { INITIAL_TRANSACTIONS } from './constants';
import { Transaction, AccountSummary, TransactionType, ViewState, PixReceiver, TransactionCategory } from './types';
import AnalysisView from './components/AnalysisView';
import AdvisorChat from './components/AdvisorChat';
import SettingsView from './components/SettingsView';
import TransactionList from './components/TransactionList';
import CardsView from './components/CardsView';
import PixArea from './components/PixArea';
import NewTransactionModal from './components/NewTransactionModal';

// --- UTILITÁRIOS ---

const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
};

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date('2026-01-15T00:00:00'); 
    const diff = Math.floor((today.getTime() - date.getTime()) / (1000 * 3600 * 24));

    if (diff === 0) return 'Hoje';
    if (diff === 1) return 'Ontem';
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).toUpperCase();
};

const maskCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
};

// --- COMPONENTES DE UI ---

const Toast = ({ message, type, onClose }: any) => (
    <div className={`fixed top-6 right-6 z-[100] animate-fade-in shadow-xl rounded-lg p-4 flex items-center gap-3 min-w-[320px] border-l-4
        ${type === 'success' ? 'bg-white border-green-600 text-slate-800' : 'bg-white border-red-500 text-slate-800'}`}>
        <div className={`p-2 rounded-full ${type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
            {type === 'success' ? <Check size={20}/> : <AlertCircle size={20}/>}
        </div>
        <div className="flex-1">
            <h4 className="font-bold text-sm">{type === 'success' ? 'Sucesso' : 'Atenção'}</h4>
            <p className="text-sm text-gray-600 font-medium">{message}</p>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18}/></button>
    </div>
);

// --- TELA DE VERIFICAÇÃO DE IDENTIDADE (KYC) ---
const IdentityVerification = ({ onVerified }: { onVerified: () => void }) => {
    const [step, setStep] = useState(1); // 1: Info, 2: Camera Front, 3: Camera Back, 4: Selfie, 5: Processing
    const [progress, setProgress] = useState(0);

    const simulateProcessing = () => {
        setStep(5);
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(onVerified, 500);
                    return 100;
                }
                return prev + 2;
            });
        }, 50);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white max-w-md w-full rounded-3xl shadow-xl overflow-hidden flex flex-col min-h-[500px]">
                <div className="p-6 bg-[#820AD1] text-white text-center">
                    <ShieldCheck className="mx-auto w-12 h-12 mb-2" />
                    <h2 className="text-xl font-bold">Verificação de Segurança</h2>
                    <p className="text-sm opacity-80">Precisamos confirmar que é você</p>
                </div>

                <div className="p-8 flex-1 flex flex-col items-center justify-center text-center">
                    {step === 1 && (
                        <div className="animate-fade-in">
                            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-slate-800 mb-2">Documento Oficial</h3>
                            <p className="text-slate-500 mb-8 text-sm">
                                Para sua segurança e conforme normas do Banco Central, precisamos de uma foto do seu RG ou CNH.
                            </p>
                            <button onClick={() => setStep(2)} className="w-full bg-[#820AD1] text-white py-3 rounded-full font-bold hover:bg-[#6e05b5] transition">
                                Começar Verificação
                            </button>
                        </div>
                    )}

                    {(step === 2 || step === 3) && (
                        <div className="animate-fade-in w-full">
                            <div className="w-full aspect-[1.58] bg-slate-900 rounded-xl mb-4 relative overflow-hidden flex items-center justify-center">
                                <div className="absolute inset-4 border-2 border-white/30 border-dashed rounded-lg"></div>
                                <Camera className="text-white/50 w-12 h-12" />
                                <div className="absolute bottom-4 text-white text-xs bg-black/50 px-3 py-1 rounded-full">
                                    {step === 2 ? 'Frente do Documento' : 'Verso do Documento'}
                                </div>
                            </div>
                            <p className="text-sm text-slate-500 mb-6">Posicione o documento dentro da moldura</p>
                            <button onClick={() => setStep(step + 1)} className="w-full bg-slate-900 text-white py-3 rounded-full font-bold flex items-center justify-center gap-2">
                                <Camera size={18} /> Capturar Foto
                            </button>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="animate-fade-in w-full">
                            <div className="w-48 h-48 bg-slate-900 rounded-full mx-auto mb-6 relative overflow-hidden flex items-center justify-center border-4 border-[#820AD1]">
                                <ScanFace className="text-white/50 w-16 h-16" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mb-2">Hora da Selfie</h3>
                            <p className="text-slate-500 mb-6 text-sm">Olhe diretamente para a câmera e certifique-se que o local está iluminado.</p>
                            <button onClick={simulateProcessing} className="w-full bg-[#820AD1] text-white py-3 rounded-full font-bold">
                                Tirar Selfie
                            </button>
                        </div>
                    )}

                    {step === 5 && (
                        <div className="w-full animate-fade-in">
                            <Loader2 className="w-12 h-12 text-[#820AD1] animate-spin mx-auto mb-6" />
                            <h3 className="font-bold text-slate-800 mb-2">Analisando Documentos...</h3>
                            <p className="text-xs text-slate-500 mb-6">Validando junto à base de dados oficial.</p>
                            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                                <div className="bg-[#820AD1] h-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                            </div>
                        </div>
                    )}
                </div>
                
                {step < 5 && (
                    <div className="p-4 border-t text-center">
                        <button className="text-sm text-slate-400 font-bold">Cancelar</button>
                    </div>
                )}
            </div>
        </div>
    );
}

// --- TELA DE LOGIN AVANÇADA ---
const LoginScreen = ({ onLogin, loading }: any) => {
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState(1);
  const [isFaceId, setIsFaceId] = useState(false);

  const handleCpfChange = (e: any) => setCpf(maskCPF(e.target.value));

  const handleNext = () => {
    if (step === 1 && cpf.length === 14) setStep(2);
    else if (step === 2 && password.length > 0) {
        setIsFaceId(true);
        setTimeout(() => {
            onLogin();
        }, 1800);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
      if(e.key === 'Enter') handleNext();
  }

  return (
    <div className="min-h-screen bg-[#820AD1] flex flex-col items-center justify-center p-6 text-white font-sans relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#9e3ddb] to-[#820AD1] z-0"></div>
        
        <div className="w-full max-w-[360px] bg-white rounded-[2rem] p-8 shadow-2xl z-10 text-slate-800 relative min-h-[400px] flex flex-col">
           {loading || isFaceId ? (
             <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                 <div className="relative">
                    <ScanFace className="w-16 h-16 text-[#820AD1] animate-pulse" />
                    <div className="absolute inset-0 border-4 border-[#820AD1]/30 rounded-lg animate-ping"></div>
                 </div>
                 <div className="text-center">
                    <p className="font-bold text-slate-800 text-lg">Face ID</p>
                    <p className="text-sm text-slate-500">Autenticando...</p>
                 </div>
             </div>
           ) : (
             <>
               <div className="mb-8">
                  <span className="text-3xl font-bold text-[#820AD1] tracking-tight">Nu</span>
                  <span className="text-lg text-slate-500 ml-1 font-medium">Bank</span>
               </div>
               
               <h2 className="text-xl font-bold mb-1 text-slate-800">
                 {step === 1 ? 'Acesse sua conta' : 'Digite sua senha'}
               </h2>

               <div className="space-y-6 mt-6 flex-1">
                  {step === 1 ? (
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 ml-1 uppercase tracking-wider">CPF</label>
                        <input 
                          type="text" 
                          placeholder="000.000.000-00" 
                          value={cpf}
                          onChange={handleCpfChange}
                          onKeyDown={handleKeyDown}
                          maxLength={14}
                          autoFocus
                          className="w-full text-xl bg-transparent border-b border-gray-300 py-2 outline-none focus:border-[#820AD1] text-slate-900 placeholder:text-gray-300 font-medium"
                        />
                    </div>
                  ) : (
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-400 ml-1 uppercase tracking-wider">Senha de 8 dígitos</label>
                       <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={handleKeyDown}
                        maxLength={8}
                        autoFocus
                        className="w-full text-2xl tracking-[0.4em] bg-transparent border-b border-gray-300 py-2 outline-none focus:border-[#820AD1] text-slate-900 font-bold"
                      />
                    </div>
                  )}

                  <div className="flex justify-end pt-4">
                     <button 
                        onClick={handleNext}
                        disabled={(step === 1 && cpf.length < 14) || (step === 2 && password.length === 0)}
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg
                            ${((step === 1 && cpf.length < 14) || (step === 2 && password.length === 0))
                             ? 'bg-gray-100 text-gray-300 cursor-not-allowed' 
                             : 'bg-[#820AD1] text-white hover:bg-[#6e05b5] hover:scale-105 active:scale-95'}`}
                     >
                        <ChevronRight size={28} />
                     </button>
                  </div>
               </div>
             </>
           )}
        </div>
        <div className="mt-8 text-white/40 text-xs font-medium">Ambiente Criptografado de Ponta a Ponta</div>
    </div>
  );
};

// Sidebar (Atualizada com Menu Completo)
const NuSidebar = ({ currentView, setCurrentView, onLogout }: any) => {
  const menuItems = [
    { id: 'dashboard', label: 'Início', icon: LayoutDashboard },
    { id: 'transactions', label: 'Extrato', icon: List },
    { id: 'pix', label: 'Área Pix', icon: QrCode },
    { id: 'cards', label: 'Cartões', icon: CreditCard },
    { id: 'advisor', label: 'Consultor AI', icon: MessageSquareText },
    { id: 'analysis', label: 'Análise', icon: PieChart },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-20 lg:w-64 bg-[#820AD1] text-white flex flex-col p-4 z-50 shadow-xl transition-all duration-300">
      <div className="mb-12 flex items-center justify-center lg:justify-start gap-2 lg:px-2">
        <div className="bg-white/20 p-2 rounded-lg"><span className="font-bold text-xl tracking-tight">Nu</span></div>
        <span className="font-semibold text-lg hidden lg:block opacity-90">NovaBank</span>
      </div>
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button key={item.id} onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center justify-center lg:justify-start lg:space-x-3 px-3 py-4 lg:py-3.5 rounded-2xl transition-all duration-200 group relative
                ${isActive ? 'bg-white text-[#820AD1] font-bold shadow-md' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}>
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-[#820AD1]' : 'text-white/80'} /> 
              <span className="hidden lg:block">{item.label}</span>
              {isActive && <div className="absolute right-0 h-8 w-1 bg-white/20 rounded-l hidden lg:block" />}
            </button>
          );
        })}
      </nav>
      <div className="mt-auto pt-6 border-t border-white/20 flex justify-center lg:justify-start">
         <button onClick={() => setCurrentView('settings')} className="flex items-center justify-center lg:justify-start lg:space-x-3 text-white/70 hover:text-white hover:bg-white/10 p-3 lg:px-4 rounded-xl transition w-full mb-2">
            <Settings size={20} /><span className="hidden lg:block text-sm font-semibold">Configurar</span>
         </button>
         <button onClick={onLogout} className="flex items-center justify-center lg:justify-start lg:space-x-3 text-white/70 hover:text-white hover:bg-white/10 p-3 lg:px-4 rounded-xl transition w-full">
            <LogIn size={20} className="rotate-180" /><span className="hidden lg:block text-sm font-semibold">Sair</span>
         </button>
      </div>
    </div>
  );
};

// --- COMPONENTE DASHBOARD PRINCIPAL ---
const NuDashboard = ({ summary, recentTransactions, onViewChange, showBalance, setShowBalance }: any) => {
  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto pb-10">
      {/* Saldo da Conta */}
      <div className="bg-white p-6 md:p-8 rounded-[28px] shadow-sm hover:shadow-md transition duration-300 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
           <div className="flex items-center gap-3">
               <h2 className="text-xl font-bold text-slate-700">Conta</h2>
               <ChevronRight size={20} className="text-gray-400 cursor-pointer hover:translate-x-1 transition" />
           </div>
           <ArrowUpRight size={20} className="text-gray-300"/>
        </div>
        
        <div className="mb-8">
             <div className="text-3xl font-bold text-slate-900 mt-1 font-mono tracking-tight">
                {showBalance ? formatCurrency(summary.balance) : '••••••••'}
             </div>
             {showBalance && (
                <p className="text-xs font-bold text-green-600 bg-green-50 inline-block px-2 py-1 rounded-lg mt-2">
                   + R$ {(summary.balance * 0.0004).toFixed(2)} rendimento hoje (102% CDI)
                </p>
             )}
        </div>

        {/* Atalhos Rápidos */}
        <div className="flex gap-4 md:gap-8 overflow-x-auto pb-4 custom-scrollbar snap-x">
           <QuickActionButton icon={QrCode} label="Área Pix" onClick={() => onViewChange('pix')} />
           <QuickActionButton icon={Barcode} label="Pagar" />
           <QuickActionButton icon={ArrowDownLeft} label="Transferir" onClick={() => onViewChange('pix')} />
           <QuickActionButton icon={Smartphone} label="Recarga" />
           <QuickActionButton icon={Lock} label="Bloquear" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {/* Card Fatura */}
         <div 
            onClick={() => onViewChange('cards')}
            className="bg-white p-6 md:p-8 rounded-[28px] shadow-sm border border-gray-100 cursor-pointer group hover:bg-[#F5F5F5] transition"
         >
            <CreditCard size={28} className="text-slate-800 mb-6 group-hover:scale-110 transition duration-300"/>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Cartão de crédito</h3>
            <span className="text-sm text-slate-500 block mb-1 font-medium">Fatura atual</span>
            <div className="text-2xl font-bold text-slate-900 mt-1">
                {showBalance ? formatCurrency(summary.expenses * -1) : '••••'}
            </div>
            <span className="text-sm text-slate-500 mt-1 block">
                Limite disponível: <span className="font-bold text-[#1f7f45]">{formatCurrency(summary.creditLimit - summary.creditUsed)}</span>
            </span>
         </div>

         {/* Open Finance Card (Novidade) */}
         <div onClick={() => onViewChange('settings')} className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 md:p-8 rounded-[28px] shadow-lg text-white cursor-pointer hover:shadow-xl transition flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
            <div>
               <div className="flex items-center gap-2 mb-4">
                  <BrainCircuit size={24} className="text-indigo-200" />
                  <h3 className="text-lg font-bold">Open Finance</h3>
               </div>
               <p className="text-indigo-100 text-sm leading-relaxed mb-4">
                  Conecte suas outras contas e deixe nossa IA organizar toda sua vida financeira em um só lugar.
               </p>
            </div>
            <button className="bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold transition w-fit flex items-center gap-2">
               Conectar agora <ArrowRight size={16} />
            </button>
         </div>
      </div>
    </div>
  );
};

const QuickActionButton = ({ icon: Icon, label, onClick }: any) => (
    <button onClick={onClick} className="flex flex-col items-center gap-3 group min-w-[76px] snap-center">
        <div className="w-[72px] h-[72px] rounded-full bg-slate-100 flex items-center justify-center text-slate-900 transition-all duration-300 group-hover:bg-[#820AD1] group-hover:text-white group-hover:shadow-lg group-active:scale-95">
            <Icon size={26} strokeWidth={1.5} />
        </div>
        <span className="text-sm font-bold text-slate-700 text-center tracking-tight leading-4 group-hover:text-[#820AD1] transition-colors">{label}</span>
    </button>
);

// Auxiliar para icones no import
import { Building2, ArrowRight } from 'lucide-react';

// --- APP PRINCIPAL ---
function App() {
  const [appState, setAppState] = useState<'LOGIN' | 'VERIFICATION' | 'APP'>('LOGIN');
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [showBalance, setShowBalance] = useState(true);
  const [toast, setToast] = useState<{message:string, type:'success'|'error'} | null>(null);

  // Calcula Saldos Reais
  const accountSummary = useMemo(() => {
    const completed = transactions.filter(t => t.status === 'COMPLETED');
    const income = completed.filter(t => t.amount > 0).reduce((a, b) => a + b.amount, 0);
    const expenses = completed.filter(t => t.amount < 0).reduce((a, b) => a + b.amount, 0);
    
    return {
      balance: income + expenses,
      income, expenses, creditLimit: 14500.00, creditUsed: Math.abs(expenses), pendingBalance: 0
    };
  }, [transactions]);

  // Simulação de Rendimento Diário (Realismo 2026)
  useEffect(() => {
    // Adiciona "rendimento" a cada 60s se ainda não tiver ocorrido hoje
    const interval = setInterval(() => {
       const today = new Date().toISOString().split('T')[0];
       const hasYieldToday = transactions.some(t => t.date === today && t.description === 'Rendimento Automático');
       
       if (!hasYieldToday && accountSummary.balance > 0) {
           const yieldAmount = accountSummary.balance * 0.0004; // aprox 0.04% ao dia (~100% CDI)
           const newTx: Transaction = {
               id: `yield-${Date.now()}`,
               date: today,
               description: 'Rendimento Automático',
               amount: yieldAmount,
               type: TransactionType.DEPOSIT,
               category: TransactionCategory.INVESTMENT,
               merchant: 'NuInvest',
               status: 'COMPLETED'
           };
           setTransactions(prev => [newTx, ...prev]);
           setToast({ message: `Seu dinheiro rendeu R$ ${yieldAmount.toFixed(2)} hoje!`, type: 'success' });
       }
    }, 30000); // Check a cada 30s
    return () => clearInterval(interval);
  }, [accountSummary.balance, transactions]);


  const handleLoginSuccess = () => {
      // Simula checagem se o usuário já verificou identidade
      // Por padrão, vamos forçar a verificação na primeira vez para mostrar a feature
      setAppState('VERIFICATION');
  };

  const handleVerificationSuccess = () => {
      setToast({ message: "Identidade confirmada com sucesso!", type: 'success' });
      setAppState('APP');
      setTimeout(() => setToast(null), 3000);
  };

  const handleTransfer = (val: number, receiverName: string) => {
      const newTx: Transaction = {
          id: Math.random().toString(),
          amount: -val,
          date: new Date().toISOString().split('T')[0], // Data de hoje real
          description: `Pix Enviado`,
          merchant: receiverName,
          type: TransactionType.PIX_OUT,
          category: 'Transferência',
          status: 'COMPLETED'
      };
      setTransactions(prev => [newTx, ...prev]);
      setToast({ message: `Pix de ${formatCurrency(val)} enviado!`, type: 'success' });
      setTimeout(() => setToast(null), 4000);
  };

  if (appState === 'LOGIN') {
    return <LoginScreen onLogin={handleLoginSuccess} loading={false} />;
  }

  if (appState === 'VERIFICATION') {
      return <IdentityVerification onVerified={handleVerificationSuccess} />;
  }

  return (
    <div className="flex min-h-screen bg-[#F0F1F5] font-sans text-slate-900 overflow-hidden">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <NuSidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        onLogout={() => setAppState('LOGIN')} 
      />

      <div className="flex-1 h-screen overflow-y-auto">
        <header className="flex justify-between items-center py-6 px-8 lg:px-12 sticky top-0 bg-[#F0F1F5]/90 backdrop-blur-md z-20">
            <div><h1 className="text-xl font-bold text-slate-700">Olá, Cliente</h1></div>
            <div className="flex gap-4 items-center">
                 <button onClick={() => setShowBalance(!showBalance)} className="bg-white hover:bg-slate-100 p-3 rounded-full transition shadow-sm border border-slate-200">
                    {showBalance ? <Eye size={20} className="text-[#820AD1]"/> : <EyeOff size={20} className="text-slate-400"/>}
                 </button>
                 <div className="w-10 h-10 rounded-full bg-[#820AD1] flex items-center justify-center text-white font-bold cursor-pointer hover:opacity-90 transition shadow-lg shadow-purple-200">
                    C
                 </div>
            </div>
        </header>

        <main className="px-6 pb-20 lg:px-12 max-w-[1400px] mx-auto">
            {currentView === 'dashboard' && <NuDashboard summary={accountSummary} recentTransactions={transactions} onViewChange={setCurrentView} showBalance={showBalance} setShowBalance={setShowBalance}/>}
            
            {currentView === 'pix' && (
                <PixArea 
                    balance={accountSummary.balance} 
                    onBack={() => setCurrentView('dashboard')} 
                    onTransfer={handleTransfer} 
                />
            )}
            
            {currentView === 'transactions' && (
                <TransactionList transactions={transactions} />
            )}

            {currentView === 'cards' && (
                <CardsView summary={accountSummary} />
            )}

            {currentView === 'analysis' && (
                <AnalysisView transactions={transactions} />
            )}

            {currentView === 'advisor' && (
                <AdvisorChat transactions={transactions} />
            )}

            {currentView === 'settings' && (
                <SettingsView />
            )}
        </main>
      </div>
    </div>
  );
}

export default App;