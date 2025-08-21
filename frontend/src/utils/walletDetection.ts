// Utility functions for detecting and managing wallet extensions

export interface WalletInfo {
  name: string;
  installed: boolean;
  downloadUrl: string;
  description: string;
}

// Check if we're in a browser environment
export const isBrowser = () => typeof window !== 'undefined';

// Detect available wallet extensions
export const detectWallets = (): WalletInfo[] => {
  if (!isBrowser()) {
    return [];
  }

  const wallets: WalletInfo[] = [
    {
      name: 'Polkadot.js Extension',
      installed: !!(window as any).injectedWeb3?.['polkadot-js'],
      downloadUrl: 'https://polkadot.js.org/extension/',
      description: 'The official Polkadot extension for managing accounts and signing transactions'
    },
    {
      name: 'Talisman',
      installed: !!(window as any).injectedWeb3?.['talisman'],
      downloadUrl: 'https://talisman.xyz/',
      description: 'A beautiful and user-friendly wallet for Polkadot and Ethereum'
    },
    {
      name: 'SubWallet',
      installed: !!(window as any).injectedWeb3?.['subwallet-js'],
      downloadUrl: 'https://subwallet.app/',
      description: 'Comprehensive wallet supporting multiple Substrate-based networks'
    },
    {
      name: 'Nova Wallet',
      installed: !!(window as any).injectedWeb3?.['nova'],
      downloadUrl: 'https://novawallet.io/',
      description: 'Next-gen wallet for Polkadot & Kusama ecosystem'
    }
  ];

  return wallets;
};

// Get installed wallets only
export const getInstalledWallets = (): WalletInfo[] => {
  return detectWallets().filter(wallet => wallet.installed);
};

// Check if any wallet is installed
export const hasAnyWallet = (): boolean => {
  return getInstalledWallets().length > 0;
};

// Get wallet installation recommendations
export const getWalletRecommendations = (): WalletInfo[] => {
  const allWallets = detectWallets();
  const uninstalled = allWallets.filter(wallet => !wallet.installed);
  
  // Prioritize Polkadot.js and Talisman for new users
  const priority = ['Polkadot.js Extension', 'Talisman'];
  
  return uninstalled.sort((a, b) => {
    const aIndex = priority.indexOf(a.name);
    const bIndex = priority.indexOf(b.name);
    
    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return 0;
  });
};

// Wait for wallet injection (some wallets inject asynchronously)
export const waitForWalletInjection = (timeout = 3000): Promise<boolean> => {
  return new Promise((resolve) => {
    if (!isBrowser()) {
      resolve(false);
      return;
    }

    const checkWallets = () => {
      return hasAnyWallet();
    };

    if (checkWallets()) {
      resolve(true);
      return;
    }

    const startTime = Date.now();
    const interval = setInterval(() => {
      if (checkWallets()) {
        clearInterval(interval);
        resolve(true);
      } else if (Date.now() - startTime > timeout) {
        clearInterval(interval);
        resolve(false);
      }
    }, 100);
  });
};

// Format address for display (show first 6 and last 4 characters)
export const formatAddress = (address: string, length = 10): string => {
  if (!address || address.length <= length) {
    return address;
  }
  
  const start = Math.floor(length / 2);
  const end = length - start;
  
  return `${address.slice(0, start)}...${address.slice(-end)}`;
};

// Validate Polkadot address format
export const isValidPolkadotAddress = (address: string): boolean => {
  // Basic validation - Polkadot addresses are typically 48 characters
  // and start with '1' for mainnet or '5' for generic substrate
  if (!address || typeof address !== 'string') {
    return false;
  }
  
  // Check length (standard Polkadot address length)
  if (address.length !== 48) {
    return false;
  }
  
  // Check if it starts with valid prefixes
  const validPrefixes = ['1', '5', '12', '13', '14', '15']; // Common Polkadot/Substrate prefixes
  return validPrefixes.some(prefix => address.startsWith(prefix));
};

// Get network-specific address format
export const getNetworkAddress = (address: string, ss58Format: number): string => {
  // This would typically use @polkadot/util-crypto to convert addresses
  // For now, return the original address
  // TODO: Implement proper SS58 address conversion
  return address;
};
