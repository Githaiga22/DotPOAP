// Polkadot.js configuration for DotPOAP
export const POLKADOT_CONFIG = {
  // Asset Hub Paseo testnet configuration
  NETWORK: {
    name: 'Asset Hub Paseo',
    rpcUrl: 'wss://sys.ibp.network/asset-hub-paseo', // Changed to working endpoint
    // Alternative RPC endpoints (ordered by reliability and performance)
    fallbackRpcUrls: [
      // IBP Network - Community infrastructure (working)
      'wss://sys.ibp.network/asset-hub-paseo',
      // Dwellir - High performance, reliable
      'wss://api-paseo.n.dwellir.com/8c94c844-c962-4c83-8972-02744738983f',
      // LuckyFriday - Alternative provider
      'wss://rpc-asset-hub-paseo.luckyfriday.io',
      // Dotters Network - Community provider
      'wss://paseo-asset-hub.dotters.network',
      // StakeWorld - Additional fallback
      'wss://paseo-asset-hub-rpc.stakeworld.io',
      // Original endpoint as last resort
      'wss://paseo-asset-hub-rpc.polkadot.io',
    ],
    chainId: 'asset-hub-paseo',
    ss58Format: 0, // Polkadot SS58 format
    tokenSymbol: 'PAS',
    tokenDecimals: 10,
  },
  
  // Contract configuration
  CONTRACT: {
    address: '0xcB3d59D424bCD9D8d58C5F4926D011252C3C1363',
    // Gas limit for contract calls
    gasLimit: {
      read: 3_000_000_000, // 3B for read operations
      write: 30_000_000_000, // 30B for write operations
    },
    // Storage deposit limit
    storageDepositLimit: null, // No limit
  },
  
  // Wallet configuration
  WALLET: {
    // Supported wallet extensions
    supportedWallets: [
      'polkadot-js',
      'talisman',
      'subwallet-js',
      'nova-wallet',
    ],
    // Default wallet preference
    defaultWallet: 'polkadot-js',
  },
  
  // API configuration
  API: {
    // Connection timeout in milliseconds (optimized for WebSocket connections)
    connectionTimeout: 15000, // Reduced to 15 seconds for faster feedback
    // Retry attempts for failed connections
    retryAttempts: 3, // Balanced retry attempts
    // Retry delay in milliseconds (with exponential backoff)
    retryDelay: 2000, // Base delay of 2 seconds
    // Health check interval in milliseconds
    healthCheckInterval: 30000, // Check connection every 30 seconds
    // WebSocket specific settings
    wsProvider: {
      // Auto-reconnect on disconnect
      autoReconnect: true,
      // Maximum reconnection attempts
      maxReconnectAttempts: 5,
      // Reconnection delay
      reconnectDelay: 3000,
    },
  },
} as const;

// Type definitions for better TypeScript support
export type NetworkConfig = typeof POLKADOT_CONFIG.NETWORK;
export type ContractConfig = typeof POLKADOT_CONFIG.CONTRACT;
export type WalletConfig = typeof POLKADOT_CONFIG.WALLET;
export type ApiConfig = typeof POLKADOT_CONFIG.API;
