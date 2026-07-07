import fs from "fs";
import path from "path";

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

const DB_PATH = path.join(process.cwd(), "db.json");

// Helper to initialize or read the database
const getDB = (): DB => {
  if (!fs.existsSync(DB_PATH)) {
    const initialDB: DB = {
      accounts: [
        { id: 1, name: "Ivan", balance: 1500 },
        { id: 2, name: "Anna", balance: 900 },
        { id: 3, name: "Alex", balance: 2300 },
      ],
      transfers: [],
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(initialDB, null, 2));
    return initialDB;
  }
  return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
};

// Helper to save the database
const saveDB = (db: DB) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
};

export const getAccounts = (): Account[] => {
  return getDB().accounts;
};

export const getAccountById = (id: number): Account | undefined => {
  return getDB().accounts.find((account) => account.id === id);
};

export const transfer = (
  fromId: number,
  toId: number,
  amount: number,
): boolean => {
  const db = getDB();
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

  saveDB(db);
  return true;
};

export const getStatistics = () => {
  const db = getDB();
  const totalBalance = db.accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const totalVolume = db.transfers.reduce((sum, t) => sum + t.amount, 0);

  return {
    totalAccounts: db.accounts.length,
    totalBalance,
    totalTransfers: db.transfers.length,
    totalVolume,
    lastOperations: db.transfers.slice(-5).reverse(), // last 5 operations
  };
};
