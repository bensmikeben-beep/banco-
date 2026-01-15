import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Transaction } from '../types';
import { chatWithAdvisor } from '../services/geminiService';
import { Send, User, Bot, Loader2, Sparkles } from 'lucide-react';

interface AdvisorChatProps {
  transactions: Transaction[];
}

const AdvisorChat: React.FC<AdvisorChatProps> = ({ transactions }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: 'Olá! Sou a IA do NovaBank. Analisei suas transações recentes. Quer saber onde você gastou mais este mês ou precisa de uma dica de economia?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Format history for API
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const responseText = await chatWithAdvisor(history, userMsg.text, transactions);

      const botMsg: ChatMessage = {
        role: 'model',
        text: responseText || "Desculpe, não consegui processar sua solicitação no momento.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        role: 'model',
        text: "Erro de conexão com o assistente.",
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Simple formatter for markdown-like bold text (Gemini often sends **text**)
  const formatText = (text: string) => {
    return text.split('\n').map((line, i) => {
      // Very basic parser for bold
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={i} className="mb-2 last:mb-0 min-h-[1.2em]">
          {parts.map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={j}>{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] max-w-4xl mx-auto bg-white rounded-[32px] shadow-xl border border-slate-100 overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 bg-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
             <Bot size={24} />
          </div>
          <div>
            <h2 className="font-bold text-slate-800 text-lg">NovaBank AI</h2>
            <p className="text-xs text-green-600 font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Online e Conectado
            </p>
          </div>
        </div>
        <div className="bg-indigo-50 px-3 py-1 rounded-full text-indigo-600 text-xs font-bold flex items-center gap-1">
           <Sparkles size={12} /> Powered by Gemini
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F8FAFC]" ref={scrollRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[85%] gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm mt-1 ${
                msg.role === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-[#820AD1] text-white'
              }`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>

              {/* Bubble */}
              <div className={`p-5 rounded-3xl text-sm leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-white text-slate-800 rounded-tr-none border border-slate-100' 
                  : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
              }`}>
                <div className="text-slate-700">
                  {formatText(msg.text)}
                </div>
                <span className={`text-[10px] block mt-2 opacity-50 font-medium ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
             <div className="flex max-w-[80%] gap-4">
              <div className="w-8 h-8 rounded-full bg-[#820AD1] text-white flex items-center justify-center mt-1">
                 <Bot size={16} />
              </div>
              <div className="bg-white p-4 rounded-3xl rounded-tl-none shadow-sm border border-slate-100 flex items-center gap-3">
                 <Loader2 size={18} className="animate-spin text-[#820AD1]" />
                 <span className="text-slate-500 text-sm font-medium">Analisando dados...</span>
              </div>
             </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100">
        <div className="flex gap-3 relative max-w-4xl mx-auto">
          <input
            type="text"
            className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 pr-14 focus:outline-none focus:ring-2 focus:ring-[#820AD1] focus:border-transparent text-slate-800 placeholder:text-slate-400 transition-all shadow-inner"
            placeholder="Pergunte sobre seus gastos, saldo ou peça conselhos..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            autoFocus
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-[#820AD1] text-white rounded-xl hover:bg-[#6e05b5] disabled:opacity-50 disabled:hover:bg-[#820AD1] transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            <Send size={20} />
          </button>
        </div>
        <p className="text-center text-[10px] text-slate-400 mt-3">
           A IA pode cometer erros. Verifique informações importantes.
        </p>
      </div>
    </div>
  );
};

export default AdvisorChat;