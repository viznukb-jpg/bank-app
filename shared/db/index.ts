import fs from "fs";
import path from "path";
import type { Account, Transfer, Statistics } from "@/shared/types";

export type DB = {
  accounts: Account[];
  transfers: Transfer[];
};

const DB_PATH = path.join(process.cwd(), "db.json");

const getDB = (): DB => {
  if (!fs.existsSync(DB_PATH)) {
    const initialDB: DB = {
      accounts: [
        { id: 1, name: "Ivan", balance: 1500 },
        { id: 2, name: "Anna", balance: 900 },
        { id: 3, name: "Alex", balance: 2300 },
        { id: 4, name: "Maria", balance: 3400 },
        { id: 5, name: "Dmytro", balance: 1200 },
        { id: 6, name: "Olena", balance: 5000 },
        { id: 7, name: "Max", balance: 750 },
        { id: 8, name: "Sofia", balance: 4100 },
        { id: 9, name: "Oleg", balance: 600 },
        { id: 10, name: "Kateryna", balance: 2900 },
      ],
      transfers: [],
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(initialDB, null, 2));
    return initialDB;
  }
  return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
};

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
  if (fromId === toId) return false;

  const db = getDB();
  const fromAccIndex = db.accounts.findIndex((account) => account.id === fromId);
  const toAccIndex = db.accounts.findIndex((account) => account.id === toId);

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

export const getStatistics = (): Statistics => {
  const db = getDB();
  const totalBalance = db.accounts.reduce((sum, account) => sum + account.balance, 0);
  const totalVolume = db.transfers.reduce((sum, transfer) => sum + transfer.amount, 0);

  return {
    totalAccounts: db.accounts.length,
    totalBalance,
    totalTransfers: db.transfers.length,
    totalVolume,
    lastOperations: db.transfers.slice(-5).reverse(),
  };
};
