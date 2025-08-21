import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { CheckCircle, AlertCircle, Loader2, RefreshCw, Wifi, WifiOff, TestTube } from 'lucide-react';
import { usePolkadot } from '@/contexts/PolkadotContext';
import { POLKADOT_CONFIG } from '@/config/polkadot';
import { runFullConnectivityTest, type ContractTestResult } from '@/utils/contractTest';

export const NetworkStatus: React.FC = () => {
  const { api, contract, isApiReady, apiError, reconnectApi, selectedAccount } = usePolkadot();
  const [testResults, setTestResults] = useState<any>(null);
  const [isTesting, setIsTesting] = useState(false);

  const getNetworkInfo = () => {
    if (!api || !isApiReady) return null;

    try {
      return {
        chainName: api.runtimeChain?.toString() || 'Unknown',
        version: api.runtimeVersion?.specVersion?.toString() || 'Unknown',
        nodeVersion: api.runtimeVersion?.implVersion?.toString() || 'Unknown',
      };
    } catch (error) {
      console.warn('Error getting network info:', error);
      return null;
    }
  };

  const networkInfo = getNetworkInfo();

  const runConnectivityTest = async () => {
    if (!api) return;

    setIsTesting(true);
    try {
      const results = await runFullConnectivityTest(
        api,
        contract,
        selectedAccount?.address
      );
      setTestResults(results);
    } catch (error) {
      console.error('Test failed:', error);
      setTestResults({
        network: { success: false, message: 'Test failed' },
        contract: { success: false, message: 'Test failed' },
        overall: false
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isApiReady ? (
            <Wifi className="h-5 w-5 text-green-500" />
          ) : (
            <WifiOff className="h-5 w-5 text-red-500" />
          )}
          Network Status
        </CardTitle>
        <CardDescription>
          Connection status to Asset Hub Paseo testnet
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Connection:</span>
          <div className="flex items-center gap-2">
            {isApiReady ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-500" />
                <Badge variant="default" className="bg-green-500/10 text-green-600">
                  Connected
                </Badge>
              </>
            ) : apiError ? (
              <>
                <AlertCircle className="h-4 w-4 text-red-500" />
                <Badge variant="destructive">
                  Disconnected
                </Badge>
              </>
            ) : (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />
                <Badge variant="secondary">
                  Connecting...
                </Badge>
              </>
            )}
          </div>
        </div>

        {/* Network Details */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Network:</span>
            <span className="font-medium">{POLKADOT_CONFIG.NETWORK.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Token:</span>
            <span className="font-medium">{POLKADOT_CONFIG.NETWORK.tokenSymbol}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">SS58 Format:</span>
            <span className="font-medium">{POLKADOT_CONFIG.NETWORK.ss58Format}</span>
          </div>
          
          {networkInfo && (
            <>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Chain:</span>
                <span className="font-medium">{networkInfo.chainName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Runtime:</span>
                <span className="font-medium">v{networkInfo.version}</span>
              </div>
            </>
          )}
        </div>

        {/* Contract Status */}
        <div className="pt-2 border-t border-border">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Smart Contract:</span>
            <Badge variant={isApiReady ? "default" : "secondary"}>
              {isApiReady ? "Ready" : "Not Ready"}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground font-mono break-all">
            {POLKADOT_CONFIG.CONTRACT.address}
          </div>
        </div>

        {/* Error Display */}
        {apiError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <div className="font-medium mb-1">Connection Error:</div>
              <div className="text-xs mb-2">{apiError}</div>
              <div className="text-xs text-muted-foreground">
                Try refreshing the connection or check your internet connectivity.
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            onClick={reconnectApi}
            disabled={isApiReady && !apiError}
            className="w-full"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {isApiReady ? 'Refresh Connection' : 'Retry Connection'}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={runConnectivityTest}
            disabled={!isApiReady || isTesting}
            className="w-full"
          >
            <TestTube className={`h-4 w-4 mr-2 ${isTesting ? 'animate-pulse' : ''}`} />
            {isTesting ? 'Testing...' : 'Test Connection'}
          </Button>
        </div>

        {/* Test Results */}
        {testResults && (
          <div className="pt-2 border-t border-border space-y-2">
            <div className="text-sm font-medium">Connection Test Results:</div>

            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span>Network:</span>
                <Badge variant={testResults.network.success ? "default" : "destructive"}>
                  {testResults.network.success ? "✓ Pass" : "✗ Fail"}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span>Contract:</span>
                <Badge variant={testResults.contract.success ? "default" : "destructive"}>
                  {testResults.contract.success ? "✓ Pass" : "✗ Fail"}
                </Badge>
              </div>

              {testResults.account && (
                <div className="flex items-center justify-between">
                  <span>Account:</span>
                  <Badge variant={testResults.account.success ? "default" : "destructive"}>
                    {testResults.account.success ? "✓ Pass" : "✗ Fail"}
                  </Badge>
                </div>
              )}

              <div className="flex items-center justify-between font-medium">
                <span>Overall:</span>
                <Badge variant={testResults.overall ? "default" : "destructive"}>
                  {testResults.overall ? "✓ Ready" : "✗ Issues"}
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* RPC Endpoints Info */}
        <div className="pt-2 border-t border-border">
          <div className="text-xs text-muted-foreground space-y-1">
            <div className="font-medium">RPC Endpoints:</div>
            <div>Primary: {POLKADOT_CONFIG.NETWORK.rpcUrl}</div>
            <div>Fallbacks: {POLKADOT_CONFIG.NETWORK.fallbackRpcUrls.length} available</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
