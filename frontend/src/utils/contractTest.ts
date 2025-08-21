// Utility functions for testing smart contract connectivity

import { ApiPromise } from '@polkadot/api';
import { ContractPromise } from '@polkadot/api-contract';
import { POLKADOT_CONFIG } from '@/config/polkadot';

export interface ContractTestResult {
  success: boolean;
  message: string;
  details?: any;
}

// Test basic contract connectivity
export const testContractConnection = async (
  api: ApiPromise,
  contract: ContractPromise
): Promise<ContractTestResult> => {
  try {
    if (!api || !contract) {
      return {
        success: false,
        message: 'API or Contract not initialized'
      };
    }

    // Check if API is connected
    if (!api.isConnected) {
      return {
        success: false,
        message: 'API is not connected to the network'
      };
    }

    // Verify contract address exists on chain
    const contractInfo = await api.query.system.account(POLKADOT_CONFIG.CONTRACT.address);
    
    if (!contractInfo || contractInfo.isEmpty) {
      return {
        success: false,
        message: 'Contract not found at the specified address',
        details: { address: POLKADOT_CONFIG.CONTRACT.address }
      };
    }

    // Try to read contract metadata
    const contractAbi = contract.abi;
    if (!contractAbi) {
      return {
        success: false,
        message: 'Contract ABI not loaded properly'
      };
    }

    // Check if contract has expected methods
    const expectedMethods = ['create_event', 'mint_poap', 'get_event', 'get_user_poaps'];
    const availableMethods = contractAbi.messages.map(msg => msg.method);
    
    const missingMethods = expectedMethods.filter(method => 
      !availableMethods.includes(method)
    );

    if (missingMethods.length > 0) {
      return {
        success: false,
        message: 'Contract missing expected methods',
        details: { 
          missing: missingMethods,
          available: availableMethods
        }
      };
    }

    return {
      success: true,
      message: 'Contract connection successful',
      details: {
        address: POLKADOT_CONFIG.CONTRACT.address,
        methods: availableMethods.length,
        network: api.runtimeChain?.toString()
      }
    };

  } catch (error) {
    return {
      success: false,
      message: 'Contract test failed',
      details: { error: error instanceof Error ? error.message : String(error) }
    };
  }
};

// Test network connectivity and chain info
export const testNetworkConnection = async (api: ApiPromise): Promise<ContractTestResult> => {
  try {
    if (!api) {
      return {
        success: false,
        message: 'API not initialized'
      };
    }

    // Check connection status
    if (!api.isConnected) {
      return {
        success: false,
        message: 'Not connected to network'
      };
    }

    // Get chain information
    const [chain, version, properties] = await Promise.all([
      api.runtimeChain,
      api.runtimeVersion,
      api.rpc.system.properties()
    ]);

    // Verify we're on the correct network
    const expectedChain = 'Asset Hub Paseo';
    const actualChain = chain?.toString() || 'Unknown';
    
    if (!actualChain.toLowerCase().includes('asset') && !actualChain.toLowerCase().includes('paseo')) {
      return {
        success: false,
        message: 'Connected to wrong network',
        details: {
          expected: expectedChain,
          actual: actualChain
        }
      };
    }

    // Get latest block
    const latestBlock = await api.rpc.chain.getBlock();
    const blockNumber = latestBlock.block.header.number.toNumber();

    return {
      success: true,
      message: 'Network connection successful',
      details: {
        chain: actualChain,
        version: version.specVersion.toString(),
        latestBlock: blockNumber,
        tokenSymbol: properties.tokenSymbol?.toString(),
        tokenDecimals: properties.tokenDecimals?.toString()
      }
    };

  } catch (error) {
    return {
      success: false,
      message: 'Network test failed',
      details: { error: error instanceof Error ? error.message : String(error) }
    };
  }
};

// Test account balance and permissions
export const testAccountConnection = async (
  api: ApiPromise,
  accountAddress: string
): Promise<ContractTestResult> => {
  try {
    if (!api || !accountAddress) {
      return {
        success: false,
        message: 'API or account address not provided'
      };
    }

    // Get account information
    const accountInfo = await api.query.system.account(accountAddress);
    
    if (!accountInfo || accountInfo.isEmpty) {
      return {
        success: false,
        message: 'Account not found on chain',
        details: { address: accountAddress }
      };
    }

    // Get balance information
    const balance = accountInfo.data;
    const freeBalance = balance.free.toString();
    const reservedBalance = balance.reserved.toString();
    
    // Check if account has sufficient balance for transactions
    const minBalance = api.consts.balances?.existentialDeposit?.toString() || '0';
    const hasMinBalance = BigInt(freeBalance) > BigInt(minBalance);

    return {
      success: true,
      message: hasMinBalance ? 'Account ready for transactions' : 'Account has low balance',
      details: {
        address: accountAddress,
        freeBalance,
        reservedBalance,
        minBalance,
        hasMinBalance
      }
    };

  } catch (error) {
    return {
      success: false,
      message: 'Account test failed',
      details: { error: error instanceof Error ? error.message : String(error) }
    };
  }
};

// Run comprehensive connectivity test
export const runFullConnectivityTest = async (
  api: ApiPromise | null,
  contract: ContractPromise | null,
  accountAddress?: string
): Promise<{
  network: ContractTestResult;
  contract: ContractTestResult;
  account?: ContractTestResult;
  overall: boolean;
}> => {
  const results = {
    network: { success: false, message: 'Not tested' } as ContractTestResult,
    contract: { success: false, message: 'Not tested' } as ContractTestResult,
    account: undefined as ContractTestResult | undefined,
    overall: false
  };

  // Test network connection
  if (api) {
    results.network = await testNetworkConnection(api);
  }

  // Test contract connection
  if (api && contract) {
    results.contract = await testContractConnection(api, contract);
  }

  // Test account connection if address provided
  if (api && accountAddress) {
    results.account = await testAccountConnection(api, accountAddress);
  }

  // Determine overall success
  results.overall = results.network.success && results.contract.success;
  if (results.account) {
    results.overall = results.overall && results.account.success;
  }

  return results;
};
