type Account = { id: number; name: string; balance: number };
type DB = { accounts: Account[] };

export const db: DB = {
  accounts: [
    { id: 1, name: "Ivan", balance: 1500 },
    { id: 2, name: "Anna", balance: 900 },
    { id: 3, name: "Alex", balance: 2300 },
  ],
};
