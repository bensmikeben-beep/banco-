import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, AIAnalysisResult } from "../types";

// In a real production app, this would be a backend call. 
// For this demo, we use the process.env as instructed.
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const analyzeFinancialData = async (transactions: Transaction[]): Promise<AIAnalysisResult> => {
  if (!apiKey) {
    return {
      summary: "Modo demonstração (Sem API Key). Adicione sua chave para análise real.",
      savingsTips: ["Configure a API Key no ambiente.", "Use o painel de configurações.", "Verifique a documentação."],
      anomalies: []
    };
  }

  // Optimize context window by sending only necessary fields
  const simplifiedData = transactions.map(t => ({
    date: t.date,
    desc: t.description,
    amount: t.amount,
    cat: t.category
  }));

  const prompt = `
    Analise os seguintes dados bancários recentes.
    Atue como um consultor financeiro sênior.
    Identifique padrões de gastos, oportunidades de economia e anomalias.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Flash is sufficient and faster for this volume
      contents: JSON.stringify(simplifiedData),
      config: {
        systemInstruction: prompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { 
              type: Type.STRING, 
              description: "Um resumo executivo curto e direto sobre a saúde financeira do usuário." 
            },
            savingsTips: { 
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 dicas táticas e acionáveis para economizar dinheiro baseadas nos gastos."
            },
            anomalies: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Lista de transações suspeitas, muito altas ou fora do padrão."
            }
          },
          required: ["summary", "savingsTips", "anomalies"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response");
    
    return JSON.parse(text) as AIAnalysisResult;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      summary: "Não foi possível realizar a análise completa no momento.",
      savingsTips: ["Tente reduzir gastos supérfluos.", "Revise suas assinaturas mensais.", "Poupe 10% da renda."],
      anomalies: ["Erro na conexão com IA."]
    };
  }
};

export const chatWithAdvisor = async (
  history: { role: string; parts: { text: string }[] }[],
  message: string,
  contextData: Transaction[]
) => {
  if (!apiKey) return "Estou em modo offline. Por favor, configure sua API Key para conversar comigo.";

  // Context injection for RAG-like behavior
  const contextPrompt = `
    DADOS FINANCEIROS DO USUÁRIO (Contexto):
    ${JSON.stringify(contextData.slice(0, 30))}
    
    INSTRUÇÕES:
    Você é o Assistente Virtual do NovaBank.
    Use os dados acima para responder perguntas sobre saldo, gastos específicos e datas.
    Se a pergunta não for sobre finanças, responda educadamente que seu foco é ajudar com o banco.
    Seja conciso, amigável e use formatação Markdown se necessário.
  `;

  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      history: [
        {
          role: 'user',
          parts: [{ text: contextPrompt }],
        },
        {
          role: 'model',
          parts: [{ text: "Entendido. Tenho acesso aos dados financeiros e estou pronto para ajudar." }],
        },
        ...history
      ],
      config: {
        temperature: 0.7,
      }
    });

    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error("Chat Error:", error);
    return "Desculpe, tive um problema momentâneo de conexão. Tente novamente.";
  }
};

export const categorizeTransactionAI = async (description: string, amount: number): Promise<string> => {
    if (!apiKey) return "Outros";

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Classifique a transação: "${description}" valor R$${amount}.
            Categorias permitidas: Alimentação, Transporte, Contas, Lazer, Saúde, Compras, Educação, Investimentos.
            Retorne APENAS a palavra da categoria.`,
        });
        const text = response.text?.trim();
        // Fallback cleanup
        return text?.replace(/['"]/g, '') || "Outros";
    } catch (e) {
        return "Outros";
    }
}