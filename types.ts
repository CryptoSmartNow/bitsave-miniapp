import type { config } from "./app/providers";

export type ChainId = (typeof config.chains)[number]["id"];

export interface Update {
  id: string;
  title: string;
  content: string;
  date: string;
  isNew: boolean;
}

export interface ReadUpdate {
  id: string;
  isNew: boolean;
}

export interface SavingsPlan {
  id: string;
  address: string;
  name: string;
  currentAmount: string;
  targetAmount: string;
  progress: number;
  isEth: boolean;
  maturityTime?: number;
  penaltyPercentage: number;
  tokenName: string; // Add this property
  tokenLogo?: string; // Add this property
}

export interface User {
  fid: string;
  walletAddress: string;
}
