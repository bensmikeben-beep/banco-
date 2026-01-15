import React, { useState, useEffect } from 'react';
import { Transaction, AIAnalysisResult } from '../types';
import { analyzeFinancialData } from '../services/geminiService';
import { BrainCircuit, Lightbulb, AlertTriangle, RefreshCw, FileText } from 'lucide-react';

interface AnalysisViewProps {
  transactions: Transaction[];
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ transactions }) => {
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const result = await analyzeFinancialData(transactions);
      setAnalysis(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Run on mount
  useEffect(() => {
    if (!analysis) runAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <BrainCircuit className="text-indigo-600" />
            Inteligência Financeira
          </h2>
          <p className="text-slate-500">Relatórios gerados pela IA Gemini Pro</p>
        </div>
        <button 
          onClick={runAnalysis}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          {loading ? 'Analisando...' : 'Atualizar Análise'}
        </button>
      </div>

      {loading ? (
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
          <h3 className="text-lg font-medium text-slate-800">Processando seus dados...</h3>
          <p className="text-slate-500">A Gemini está identificando padrões nos seus gastos.</p>
        </div>
      ) : analysis ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Executive Summary */}
          <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white p-8 rounded-2xl shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <FileText size={24} className="text-indigo-200" />
              <h3 className="text-xl font-bold">Resumo Executivo</h3>
            </div>
            <p className="text-indigo-50 text-lg leading-relaxed">
              {analysis.summary}
            </p>
          </div>

          {/* Savings Tips */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600">
                <Lightbulb size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Dicas de Economia</h3>
            </div>
            <ul className="space-y-4">
              {analysis.savingsTips.map((tip, idx) => (
                <li key={idx} className="flex gap-3 items-start p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                  <span className="font-bold text-yellow-600">{idx + 1}.</span>
                  <span className="text-slate-700 text-sm">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Anomalies */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Alertas de Anomalia</h3>
            </div>
            {analysis.anomalies.length > 0 ? (
               <ul className="space-y-4">
               {analysis.anomalies.map((item, idx) => (
                 <li key={idx} className="flex gap-3 items-start p-3 bg-red-50 rounded-lg border border-red-100">
                   <div className="min-w-[6px] h-[6px] mt-2 rounded-full bg-red-500"></div>
                   <span className="text-slate-700 text-sm">{item}</span>
                 </li>
               ))}
             </ul>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-center">
                 <p className="text-slate-400">Nenhuma anomalia detectada.</p>
                 <p className="text-sm text-green-600 font-medium mt-1">Seus gastos parecem normais.</p>
              </div>
            )}
           
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-slate-400">
          Clique em "Atualizar Análise" para começar.
        </div>
      )}
    </div>
  );
};

export default AnalysisView;
