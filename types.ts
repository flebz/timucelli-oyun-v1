export interface Upgrade {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  costMultiplier: number;
  effectType: 'click' | 'auto';
  effectValue: number;
  icon: string;
}

export interface Boss {
  id: number;
  name: string;
  baseHealth: number;
  rewardKP: number; // Karizma Puanı Reward
  rewardTP: number; // Timuçelli Puanı Reward
  description: string;
}

export interface Girlfriend {
  id: string;
  name: string;
  requiredKP: number;
  description: string;
  multiplierBonus: number; // Global multiplier bonus
  imagePlaceholder: string;
}

export interface GameState {
  timucelliPuani: number;
  karizmaPuani: number;
  clickPower: number;
  autoClickPower: number;
  purchasedUpgrades: Record<string, number>; // upgradeId -> count
  currentBossIndex: number;
  unlockedGirlfriends: string[]; // ids
  lifetimeClicks: number;
}

export enum Tab {
  HOME = 'EV',
  UPGRADES = 'MARKET',
  ARENA = 'KADIKÖY',
  SOCIAL = 'MANİTALAR',
}