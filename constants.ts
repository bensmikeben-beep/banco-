import { Transaction, TransactionType, TransactionCategory } from './types';

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 't1',
    date: '2026-01-05',
    description: 'Transferência Recebida',
    amount: 5200.00,
    type: TransactionType.DEPOSIT,
    category: TransactionCategory.SALARY,
    merchant: 'Pagamento Tech',
    status: 'COMPLETED'
  },
  {
    id: 't2',
    date: '2026-01-10',
    description: 'iFood *Lanche',
    amount: -85.50,
    type: TransactionType.PAYMENT,
    category: TransactionCategory.FOOD,
    merchant: 'iFood',
    status: 'COMPLETED'
  },
  {
    id: 't3',
    date: '2026-01-12',
    description: 'Uber do Brasil',
    amount: -24.90,
    type: TransactionType.PAYMENT,
    category: TransactionCategory.TRANSPORT,
    merchant: 'Uber',
    status: 'COMPLETED'
  },
  {
    id: 't4',
    date: '2026-01-15',
    description: 'Netflix.com',
    amount: -55.90,
    type: TransactionType.PAYMENT,
    category: TransactionCategory.ENTERTAINMENT,
    merchant: 'Netflix',
    status: 'COMPLETED'
  },
  {
    id: 't5',
    date: '2026-01-18',
    description: 'Amazon Prime',
    amount: -19.90,
    type: TransactionType.PAYMENT,
    category: TransactionCategory.SHOPPING,
    merchant: 'Amazon',
    status: 'COMPLETED'
  },
  {
    id: 't6',
    date: '2026-01-20',
    description: 'Academia SmartFit',
    amount: -129.90,
    type: TransactionType.PAYMENT,
    category: TransactionCategory.HEALTH,
    merchant: 'SmartFit',
    status: 'COMPLETED'
  },
  {
    id: 't7',
    date: '2026-01-25',
    description: 'Restaurante Coco Bambu',
    amount: -340.00,
    type: TransactionType.PAYMENT,
    category: TransactionCategory.FOOD,
    merchant: 'Coco Bambu',
    status: 'COMPLETED'
  },
  {
    id: 't_pend_1',
    date: '2026-02-05',
    description: 'Depósito Bloqueado',
    amount: 1500.00,
    type: TransactionType.DEPOSIT,
    category: TransactionCategory.OTHER,
    merchant: 'Cliente Externo',
    status: 'PENDING'
  },
  {
    id: 't_pend_2',
    date: '2026-02-10',
    description: 'Conta de Luz (Agendado)',
    amount: -250.00,
    type: TransactionType.PAYMENT,
    category: TransactionCategory.UTILITIES,
    merchant: 'Enel Distribuição',
    status: 'PENDING'
  }
];

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Início', icon: 'LayoutDashboard' },
  { id: 'transactions', label: 'Movimentações', icon: 'List' },
  { id: 'analysis', label: 'Análise', icon: 'PieChart' },
  { id: 'cards', label: 'Meus Cartões', icon: 'CreditCard' },
];
