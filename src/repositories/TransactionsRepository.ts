import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface TransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public getAll(): Transaction[] {
    return this.transactions;
  }

  getTotalizadores = (acc: Balance, obj: Transaction): Balance => {
    if (obj.type === 'income') {
      acc.income += obj.value;
    }
    if (obj.type === 'outcome') {
      acc.outcome += obj.value;
    }
    return acc;
  };

  public getBalance(): Balance {
    const { income, outcome } = this.transactions.reduce(
      this.getTotalizadores,
      { income: 0, outcome: 0, total: 0 },
    );
    const total = income - outcome;
    return { income, outcome, total };
  }

  public create({ title, value, type }: TransactionDTO): Transaction {
    const transaction = new Transaction({ title, value, type });
    const balance = this.getBalance();
    if (transaction.type === 'outcome' && balance.total < transaction.value) {
      throw Error('Saldo Insuficiente, mané!');
    }
    this.transactions.push(transaction);
    return transaction;
  }
}

export default TransactionsRepository;
