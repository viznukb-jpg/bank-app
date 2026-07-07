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

export type Statistics = {
  totalAccounts: number;
  totalBalance: number;
  totalTransfers: number;
  totalVolume: number;
  lastOperations: Transfer[];
};

export type TransferPayload = {
  from: number;
  to: number;
  amount: number;
};
