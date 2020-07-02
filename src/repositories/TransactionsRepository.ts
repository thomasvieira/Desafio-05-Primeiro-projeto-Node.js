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

  getIncomes = (acc: number, obj: Transaction): number => {
    if (obj.type === 'income') {
      acc += obj.value;
    }
    return acc;
  };

  getOutcomes = (acc: number, obj: Transaction): number => {
    if (obj.type === 'outcome') {
      acc += obj.value;
    }
    return acc;
  };

  public getBalance(): Balance {
    const income = this.transactions.reduce(this.getIncomes, 0);
    const outcome = this.transactions.reduce(this.getOutcomes, 0);
    const total = income - outcome;
    return { income, outcome, total };
  }

  public create({ title, value, type }: TransactionDTO): Transaction {
    const transaction = new Transaction({ title, value, type });
    const balance = this.getBalance();
    if (transaction.type == 'outcome' && balance.total < transaction.value) {
      throw Error('Saldo Insuficiente, mané!');
    }
    this.transactions.push(transaction);
    return transaction;
  }
}

export default TransactionsRepository;
