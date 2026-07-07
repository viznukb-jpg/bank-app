export type Account = {
  id: number;
  name: string;
  balance: number;
};

export type Transfer = {
  id: number;
  from: number;
  to: number;
  amount: number;
  timestamp: string;
};

export type DB = {
  accounts: Account[];
  transfers: Transfer[];
};

const globalForDb = globalThis as unknown as {
  __db: DB;
};

if (!globalForDb.__db) {
  globalForDb.__db = {
    accounts: [
      { id: 1, name: "Ivan", balance: 1500 },
      { id: 2, name: "Anna", balance: 900 },
      { id: 3, name: "Alex", balance: 2300 },
    ],
    transfers: [],
  };
}

export const getAccounts = (): Account[] => {
  return globalForDb.__db.accounts;
};

export const getAccountById = (id: number): Account | undefined => {
  return globalForDb.__db.accounts.find((account) => account.id === id);
};

export const transfer = (
  fromId: number,
  toId: number,
  amount: number,
): boolean => {
  const db = globalForDb.__db;
  const fromAccIndex = db.accounts.findIndex((a) => a.id === fromId);
  const toAccIndex = db.accounts.findIndex((a) => a.id === toId);

  if (fromAccIndex === -1 || toAccIndex === -1) return false;
  if (db.accounts[fromAccIndex].balance < amount) return false;

  db.accounts[fromAccIndex].balance -= amount;
  db.accounts[toAccIndex].balance += amount;

  db.transfers.push({
    id: Date.now(),
    from: fromId,
    to: toId,
    amount,
    timestamp: new Date().toISOString(),
  });

  return true;
};

export const getStatistics = () => {
  const db = globalForDb.__db;
  const totalBalance = db.accounts.reduce((sum, acc) => sum + acc.balance, 0);

  return {
    totalAccounts: db.accounts.length,
    totalBalance,
    totalTransfers: db.transfers.length,
    lastOperations: db.transfers.slice(-5).reverse(),
  };
};
