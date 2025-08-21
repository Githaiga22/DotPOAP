import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { ContractPromise } from '@polkadot/api-contract';
import { POLKADOT_CONFIG } from '@/config/polkadot';

// Enhanced logging utility with timestamps and levels
const createLogger = (prefix: string) => {
  const timestamp = () => new Date().toISOString().split('T')[1].slice(0, -1);

  return {
    info: (message: string, ...args: any[]) => {
      console.log(`🔵 [${timestamp()}] [${prefix}] ${message}`, ...args);
    },
    warn: (message: string, ...args: any[]) => {
      console.warn(`🟡 [${timestamp()}] [${prefix}] ${message}`, ...args);
    },
    error: (message: string, ...args: any[]) => {
      console.error(`🔴 [${timestamp()}] [${prefix}] ${message}`, ...args);
    },
    success: (message: string, ...args: any[]) => {
      console.log(`🟢 [${timestamp()}] [${prefix}] ${message}`, ...args);
    },
    debug: (message: string, ...args: any[]) => {
      console.log(`🔍 [${timestamp()}] [${prefix}] ${message}`, ...args);
    }
  };
};

const logger = createLogger('PolkadotContext');

// Connection quality metrics
interface ConnectionMetrics {
  latency: number | null;
  connectionTime: number | null;
  currentEndpoint: string | null;
  reconnectCount: number;
  lastConnected: Date | null;
  isHealthy: boolean;
}

// Types
export interface PolkadotContextType {
  // API connection
  api: ApiPromise | null;
  isApiReady: boolean;
  apiError: string | null;
  connectionMetrics: ConnectionMetrics;

  // Wallet connection
  accounts: InjectedAccountWithMeta[];
  selectedAccount: InjectedAccountWithMeta | null;
  isWalletConnected: boolean;
  walletError: string | null;

  // Contract
  contract: ContractPromise | null;

  // Actions
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  selectAccount: (account: InjectedAccountWithMeta) => void;
  reconnectApi: () => Promise<void>;
}

const PolkadotContext = createContext<PolkadotContextType | undefined>(undefined);

interface PolkadotProviderProps {
  children: ReactNode;
}

export const PolkadotProvider: React.FC<PolkadotProviderProps> = ({ children }) => {
  // API state
  const [api, setApi] = useState<ApiPromise | null>(null);
  const [isApiReady, setIsApiReady] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Connection metrics state
  const [connectionMetrics, setConnectionMetrics] = useState<ConnectionMetrics>({
    latency: null,
    connectionTime: null,
    currentEndpoint: null,
    reconnectCount: 0,
    lastConnected: null,
    isHealthy: false,
  });

  // Wallet state
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<InjectedAccountWithMeta | null>(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletError, setWalletError] = useState<string | null>(null);

  // Contract state
  const [contract, setContract] = useState<ContractPromise | null>(null);

  // Measure network latency
  const measureLatency = async (api: ApiPromise): Promise<number> => {
    const start = performance.now();
    try {
      await api.rpc.system.chain();
      return performance.now() - start;
    } catch (error) {
      logger.warn('Failed to measure latency:', error);
      return -1;
    }
  };

  // Initialize API connection with fallback support and enhanced metrics
  const initializeApi = async () => {
    const connectionStartTime = performance.now();

    try {
      setApiError(null);
      setIsApiReady(false);

      logger.info('🚀 Starting API initialization...');
      logger.debug('Available RPC endpoints:', {
        primary: POLKADOT_CONFIG.NETWORK.rpcUrl,
        fallbacks: POLKADOT_CONFIG.NETWORK.fallbackRpcUrls
      });

      const allRpcUrls = [
        POLKADOT_CONFIG.NETWORK.rpcUrl,
        ...POLKADOT_CONFIG.NETWORK.fallbackRpcUrls
      ];

      let apiInstance: ApiPromise | null = null;
      let lastError: Error | null = null;
      let successfulEndpoint: string | null = null;

      // Try each RPC endpoint until one works
      for (let i = 0; i < allRpcUrls.length; i++) {
        const rpcUrl = allRpcUrls[i];
        const attemptStartTime = performance.now();

        try {
          logger.info(`🔄 Attempting connection ${i + 1}/${allRpcUrls.length}`, {
            endpoint: rpcUrl,
            timeout: `${POLKADOT_CONFIG.API.connectionTimeout}ms`
          });

          // Create provider with configurable timeout
          const provider = new WsProvider(rpcUrl, POLKADOT_CONFIG.API.connectionTimeout);

          // Enhanced connection event listeners
          provider.on('connected', () => {
            const connectionTime = performance.now() - attemptStartTime;
            logger.success(`🔗 WebSocket connected`, {
              endpoint: rpcUrl,
              connectionTime: `${connectionTime.toFixed(2)}ms`
            });
          });

          provider.on('disconnected', () => {
            logger.warn(`🔌 WebSocket disconnected`, { endpoint: rpcUrl });
          });

          provider.on('error', (error) => {
            logger.error(`⚠️ WebSocket error`, { endpoint: rpcUrl, error: error.message });
          });

          // Create API instance with enhanced configuration
          apiInstance = await ApiPromise.create({
            provider,
            throwOnConnect: false,
            // Add type definitions for better compatibility
            types: {},
            rpc: {},
          });

          // Wait for the API to be ready with timeout
          const readyPromise = apiInstance.isReady;
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('API ready timeout')), POLKADOT_CONFIG.API.connectionTimeout)
          );

          await Promise.race([readyPromise, timeoutPromise]);

          // Test the connection with multiple health checks
          logger.debug('🔍 Performing connection health checks...');

          const [chainInfo, nodeVersion, blockNumber] = await Promise.all([
            apiInstance.rpc.system.chain(),
            apiInstance.rpc.system.version(),
            apiInstance.rpc.chain.getHeader()
          ]);

          // Measure latency
          const latency = await measureLatency(apiInstance);

          const connectionTime = performance.now() - attemptStartTime;
          successfulEndpoint = rpcUrl;

          logger.success(`✅ Connection established and verified`, {
            endpoint: rpcUrl,
            chain: chainInfo.toString(),
            nodeVersion: nodeVersion.toString(),
            blockNumber: blockNumber.number.toString(),
            connectionTime: `${connectionTime.toFixed(2)}ms`,
            latency: latency > 0 ? `${latency.toFixed(2)}ms` : 'unknown'
          });

          // Update connection metrics
          setConnectionMetrics(prev => ({
            ...prev,
            latency,
            connectionTime,
            currentEndpoint: rpcUrl,
            lastConnected: new Date(),
            isHealthy: true
          }));

          break; // Success, exit the loop

        } catch (error) {
          const connectionTime = performance.now() - attemptStartTime;
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';

          logger.error(`❌ Connection attempt failed`, {
            endpoint: rpcUrl,
            attempt: `${i + 1}/${allRpcUrls.length}`,
            connectionTime: `${connectionTime.toFixed(2)}ms`,
            error: errorMessage
          });

          lastError = error instanceof Error ? error : new Error('Connection failed');

          // Clean up failed connection
          if (apiInstance) {
            try {
              await apiInstance.disconnect();
              logger.debug('🧹 Cleaned up failed API instance');
            } catch (disconnectError) {
              logger.warn('Error during cleanup:', disconnectError);
            }
            apiInstance = null;
          }

          // Add delay between attempts (except for the last one)
          if (i < allRpcUrls.length - 1) {
            const delay = 2000;
            logger.info(`⏳ Waiting ${delay}ms before next attempt...`);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      }

      if (!apiInstance) {
        const totalConnectionTime = performance.now() - connectionStartTime;
        logger.error('❌ All RPC endpoints failed', {
          totalAttempts: allRpcUrls.length,
          totalTime: `${totalConnectionTime.toFixed(2)}ms`,
          lastError: lastError?.message
        });

        // Update metrics for failed connection
        setConnectionMetrics(prev => ({
          ...prev,
          isHealthy: false,
          reconnectCount: prev.reconnectCount + 1
        }));

        throw lastError || new Error('All RPC endpoints failed');
      }

      setApi(apiInstance);
      setIsApiReady(true);

      // Initialize contract with better error handling
      try {
        logger.info('🔄 Initializing smart contract...');

        // Import contract metadata
        const contractMetadata = await import('../contracts/dotpoap.json');
        logger.debug('📄 Contract metadata loaded successfully');

        // Validate contract address format
        const contractAddress = POLKADOT_CONFIG.CONTRACT.address;
        if (!contractAddress || contractAddress.length !== 42) {
          throw new Error('Invalid contract address format');
        }

        // Create contract instance
        const contractInstance = new ContractPromise(
          apiInstance,
          contractMetadata.default,
          contractAddress
        );
        setContract(contractInstance);

        logger.success('✅ Smart contract initialized', {
          address: contractAddress,
          endpoint: successfulEndpoint
        });

      } catch (contractError) {
        const errorMessage = contractError instanceof Error ? contractError.message : 'Failed to initialize contract';
        logger.error('❌ Contract initialization failed:', errorMessage);
        setApiError(errorMessage);
        // Don't fail the entire connection if just contract fails
      }

      const totalConnectionTime = performance.now() - connectionStartTime;
      logger.success('🎉 Full initialization complete', {
        network: POLKADOT_CONFIG.NETWORK.name,
        endpoint: successfulEndpoint,
        totalTime: `${totalConnectionTime.toFixed(2)}ms`,
        contractAddress: POLKADOT_CONFIG.CONTRACT.address
      });

    } catch (error) {
      const totalConnectionTime = performance.now() - connectionStartTime;
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect to network';

      logger.error('❌ API initialization failed', {
        error: errorMessage,
        totalTime: `${totalConnectionTime.toFixed(2)}ms`
      });

      setApiError(errorMessage);
      setIsApiReady(false);

      // Update metrics for failed connection
      setConnectionMetrics(prev => ({
        ...prev,
        isHealthy: false,
        reconnectCount: prev.reconnectCount + 1
      }));
    }
  };

  // Retry connection with exponential backoff
  const retryConnection = async (attempt = 0) => {
    const maxRetries = POLKADOT_CONFIG.API.retryAttempts;

    if (attempt >= maxRetries) {
      console.error('❌ Max retry attempts reached');
      setApiError('Failed to connect after multiple attempts. Please check your internet connection.');
      return;
    }

    const delay = POLKADOT_CONFIG.API.retryDelay * Math.pow(2, attempt); // Exponential backoff
    console.log(`⏳ Retrying connection in ${delay}ms... (attempt ${attempt + 1}/${maxRetries})`);

    setTimeout(async () => {
      try {
        await initializeApi();
      } catch (error) {
        console.warn(`Retry attempt ${attempt + 1} failed:`, error);
        await retryConnection(attempt + 1);
      }
    }, delay);
  };

  // Connect wallet with enhanced logging and error handling
  const connectWallet = async () => {
    const walletLogger = createLogger('WalletConnection');

    try {
      setWalletError(null);
      walletLogger.info('� Starting wallet connection process...');

      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        throw new Error('Wallet connection is only available in browser environment');
      }

      // Enable the extension with app name
      walletLogger.debug('🔍 Searching for wallet extensions...');
      const extensions = await web3Enable('DotPOAP');

      walletLogger.info(`📱 Wallet extensions discovered`, {
        count: extensions.length,
        extensions: extensions.map(ext => ext.name)
      });

      if (extensions.length === 0) {
        const supportedWallets = POLKADOT_CONFIG.WALLET.supportedWallets.join(', ');
        throw new Error(
          `No wallet extension found. Please install one of the supported wallets: ${supportedWallets}`
        );
      }

      // Get accounts with proper error handling
      walletLogger.debug('🔍 Retrieving wallet accounts...');
      const allAccounts = await web3Accounts();

      walletLogger.info(`👤 Accounts retrieved`, {
        totalAccounts: allAccounts.length,
        accountSources: [...new Set(allAccounts.map(acc => acc.meta.source))]
      });

      if (allAccounts.length === 0) {
        throw new Error(
          'No accounts found in your wallet. Please:\n' +
          '1. Create an account in your wallet extension\n' +
          '2. Make sure the account is not locked\n' +
          '3. Refresh the page and try again'
        );
      }

      // Filter accounts for Polkadot/Substrate (SS58 format 0)
      const polkadotAccounts = allAccounts.filter(account =>
        account.address.length === 48 // Standard Polkadot address length
      );

      walletLogger.debug('🔍 Account filtering results', {
        totalAccounts: allAccounts.length,
        polkadotCompatible: polkadotAccounts.length,
        filtered: polkadotAccounts.length > 0
      });

      const finalAccounts = polkadotAccounts.length > 0 ? polkadotAccounts : allAccounts;

      if (polkadotAccounts.length === 0) {
        walletLogger.warn('⚠️ No Polkadot-compatible accounts found, using all accounts');
      }

      setAccounts(finalAccounts);
      setSelectedAccount(finalAccounts[0]);
      setIsWalletConnected(true);

      walletLogger.success('✅ Wallet connection successful', {
        selectedAccount: finalAccounts[0].meta.name || 'Unnamed',
        accountAddress: `${finalAccounts[0].address.slice(0, 8)}...${finalAccounts[0].address.slice(-8)}`,
        totalAccounts: finalAccounts.length,
        walletSource: finalAccounts[0].meta.source
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect wallet';
      walletLogger.error('❌ Wallet connection failed:', errorMessage);
      setWalletError(errorMessage);
      setIsWalletConnected(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setAccounts([]);
    setSelectedAccount(null);
    setIsWalletConnected(false);
    setWalletError(null);
    console.log('🔌 Wallet disconnected');
  };

  // Select account
  const selectAccount = (account: InjectedAccountWithMeta) => {
    setSelectedAccount(account);
  };

  // Reconnect API with cleanup
  const reconnectApi = async () => {
    console.log('🔄 Reconnecting to network...');

    // Clean up existing connection
    if (api) {
      try {
        await api.disconnect();
        console.log('🔌 Disconnected from previous API instance');
      } catch (error) {
        console.warn('Warning during API disconnect:', error);
      }
    }

    // Reset state
    setApi(null);
    setContract(null);
    setIsApiReady(false);
    setApiError(null);

    // Reconnect
    await initializeApi();
  };

  // Monitor connection status
  useEffect(() => {
    if (api) {
      const handleDisconnect = () => {
        console.warn('🔌 API disconnected, attempting to reconnect...');
        setIsApiReady(false);
        retryConnection();
      };

      const handleError = (error: any) => {
        console.error('🚨 API error:', error);
        setApiError(error.message || 'Network connection error');
      };

      // Listen for disconnection events
      api.on('disconnected', handleDisconnect);
      api.on('error', handleError);

      return () => {
        api.off('disconnected', handleDisconnect);
        api.off('error', handleError);
      };
    }
  }, [api]);

  // Initialize API on mount with retry logic
  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 2000; // 2 seconds

    const initWithRetry = async () => {
      try {
        await initializeApi();
      } catch (error) {
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`🔄 Retrying connection (${retryCount}/${maxRetries}) in ${retryDelay}ms...`);
          setTimeout(initWithRetry, retryDelay);
        } else {
          console.error('❌ Max retries reached, giving up');
        }
      }
    };

    initWithRetry();

    // Cleanup function
    return () => {
      if (api) {
        console.log('🧹 Cleaning up API connection...');
        api.disconnect().catch(error =>
          console.warn('Error during cleanup:', error)
        );
      }
    };
  }, []);

  const value: PolkadotContextType = {
    // API
    api,
    isApiReady,
    apiError,
    connectionMetrics,

    // Wallet
    accounts,
    selectedAccount,
    isWalletConnected,
    walletError,

    // Contract
    contract,

    // Actions
    connectWallet,
    disconnectWallet,
    selectAccount,
    reconnectApi,
  };

  return (
    <PolkadotContext.Provider value={value}>
      {children}
    </PolkadotContext.Provider>
  );
};

// Custom hook to use the Polkadot context
export const usePolkadot = (): PolkadotContextType => {
  const context = useContext(PolkadotContext);
  if (context === undefined) {
    throw new Error('usePolkadot must be used within a PolkadotProvider');
  }
  return context;
};
