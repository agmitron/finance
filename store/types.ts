export type Category = string;
export type Difference = number;
export type AccountID = string;
export type Additional = {
  timestamp: number;
  [key: string]: any
}

export interface Transaction {
  difference: Difference;
  category: Category;
  account: AccountID;
  additional: Additional
}

export interface Account {
  id: AccountID;
  currency: string;
  name: string;
}

export type Accounts = Record<AccountID, Account>;
export type Balances = Record<AccountID, number>;
export type Transactions = Record<AccountID, Transaction[]>;

export type Categories = {
  [name: string]: Categories | null;
};