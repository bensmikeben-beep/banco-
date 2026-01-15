export type TransactionStatus = 'COMPLETED' | 'PENDING' | 'FAILED';

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  TRANSFER = 'TRANSFER',
  PAYMENT = 'PAYMENT',
  PIX_OUT = 'PIX_OUT',
  PIX_IN = 'PIX_IN'
}

export enum TransactionCategory {
  FOOD = 'Alimentação',
  TRANSPORT = 'Transporte',
  UTILITIES = 'Contas e Serviços',
  ENTERTAINMENT = 'Lazer',
  SALARY = 'Salário',
  HEALTH = 'Saúde',
  SHOPPING = 'Compras',
  EDUCATION = 'Educação',
  INVESTMENT = 'Investimentos',
  OTHER = 'Outros',
  UNCATEGORIZED = 'Não categorizado',
  TRANSFER = 'Transferência'
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory | string;
  merchant?: string;
  status: TransactionStatus;
}

export interface AccountSummary {
  balance: number;
  income: number;
  expenses: number;
  creditLimit: number;
  creditUsed: number;
  pendingBalance: number;
}

export interface AIAnalysisResult {
  summary: string;
  savingsTips: string[];
  anomalies: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export type ViewState = 'dashboard' | 'transactions' | 'analysis' | 'advisor' | 'cards' | 'settings' | 'pix' | 'verification';

export interface PixReceiver {
  name: string;
  bank: string;
  cpfMasked: string;
}
