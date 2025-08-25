import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { CheckCircle, Download, ExternalLink, RefreshCw, AlertCircle, Info } from 'lucide-react';
import { detectWallets, getWalletRecommendations, waitForWalletInjection, type WalletInfo } from '@/utils/walletDetection';

export const WalletInstallHelper: React.FC = () => {
  const [wallets, setWallets] = useState<WalletInfo[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const [detectionStatus, setDetectionStatus] = useState<'checking' | 'found' | 'not-found'>('checking');

  const refreshWalletStatus = async () => {
    setIsChecking(true);
    setDetectionStatus('checking');
    
    // Wait a bit for any async wallet injections
    await waitForWalletInjection(2000);
    
    const detectedWallets = detectWallets();
    setWallets(detectedWallets);
    setLastCheck(new Date());
    setIsChecking(false);
    
    // Update detection status
    if (detectedWallets.some(w => w.installed)) {
      setDetectionStatus('found');
    } else {
      setDetectionStatus('not-found');
    }
  };

  useEffect(() => {
    refreshWalletStatus();
  }, []);

  const installedWallets = wallets.filter(w => w.installed);
  const recommendedWallets = getWalletRecommendations();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Wallet Setup
        </CardTitle>
        <CardDescription>
          Install a compatible wallet to connect to DotPOAP
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Status Indicator */}
        <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
          {detectionStatus === 'checking' && (
            <>
              <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
              <span className="text-sm text-blue-600">Checking for wallet extensions...</span>
            </>
          )}
          {detectionStatus === 'found' && (
            <>
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-600">Wallet extensions detected! You can now connect.</span>
            </>
          )}
          {detectionStatus === 'not-found' && (
            <>
              <AlertCircle className="h-4 w-4 text-orange-500" />
              <span className="text-sm text-orange-600">No wallet extensions found. Please install one below.</span>
            </>
          )}
        </div>

        {/* Refresh Button */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {lastCheck && `Last checked: ${lastCheck.toLocaleTimeString()}`}
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshWalletStatus}
            disabled={isChecking}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Installed Wallets */}
        {installedWallets.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-green-600">✅ Installed Wallets</h4>
            {installedWallets.map((wallet) => (
              <div key={wallet.name} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="font-medium">{wallet.name}</span>
                </div>
                <Badge variant="default" className="bg-green-500/10 text-green-600">
                  Ready
                </Badge>
              </div>
            ))}
            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-blue-500 mt-0.5" />
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  <p className="font-medium">Great! You have wallet extensions installed.</p>
                  <p className="mt-1">You can now use the "Connect Wallet" button to connect your wallet to DotPOAP.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Installation Recommendations */}
        {recommendedWallets.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">
              {installedWallets.length === 0 ? '📥 Recommended Wallets' : '📥 Additional Wallets'}
            </h4>
            {recommendedWallets.map((wallet) => (
              <div key={wallet.name} className="p-3 border border-border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{wallet.name}</span>
                    {wallet.name === 'Polkadot.js Extension' && (
                      <Badge variant="secondary">Recommended</Badge>
                    )}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    asChild
                  >
                    <a 
                      href={wallet.downloadUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1"
                    >
                      <Download className="h-3 w-3" />
                      Install
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {wallet.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* No Wallets Found */}
        {wallets.length === 0 && !isChecking && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No wallet extensions detected. Please install a compatible wallet and refresh this page.
            </AlertDescription>
          </Alert>
        )}

        {/* Installation Instructions */}
        <div className="pt-4 border-t border-border">
          <h4 className="text-sm font-medium mb-2">Installation Steps:</h4>
          <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
            <li>Click "Install" on a recommended wallet above</li>
            <li>Follow the browser extension installation process</li>
            <li>Create or import an account in the wallet</li>
            <li>Return to this page and click "Refresh"</li>
            <li>Use the "Connect Wallet" button to connect</li>
          </ol>
        </div>

        {/* Troubleshooting Tips */}
        <div className="pt-2 border-t border-border">
          <h4 className="text-sm font-medium mb-2">Troubleshooting:</h4>
          <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
            <li>Make sure your browser allows extensions</li>
            <li>Try refreshing the page after installing a wallet</li>
            <li>Ensure the wallet extension is unlocked</li>
            <li>Check that you have at least one account in the wallet</li>
          </ul>
        </div>

        {/* Browser Compatibility Note */}
        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground">
            <strong>Note:</strong> Wallet extensions work in desktop browsers (Chrome, Firefox, Edge). 
            Mobile users should use wallet apps with built-in browsers.
          </p>
        </div>

        {/* Debug Information */}
        <div className="pt-2 border-t border-border">
          <details className="text-xs">
            <summary className="cursor-pointer font-medium text-muted-foreground hover:text-foreground">
              🔍 Debug Information
            </summary>
            <div className="mt-2 space-y-2 text-muted-foreground">
              <div>
                <strong>Browser Environment:</strong> {typeof window !== 'undefined' ? '✅ Available' : '❌ Not Available'}
              </div>
              <div>
                <strong>Window Object:</strong> {typeof window !== 'undefined' ? '✅ Available' : '❌ Not Available'}
              </div>
              <div>
                <strong>InjectedWeb3:</strong> {typeof window !== 'undefined' && (window as any).injectedWeb3 ? '✅ Available' : '❌ Not Available'}
              </div>
              {typeof window !== 'undefined' && (window as any).injectedWeb3 && (
                <div>
                  <strong>Available Extensions:</strong> {Object.keys((window as any).injectedWeb3).join(', ') || 'None'}
                </div>
              )}
              <div>
                <strong>Direct Wallet Objects:</strong>
                <ul className="ml-4 mt-1 space-y-1">
                  <li>Polkadot: {(typeof window !== 'undefined' && (window as any).polkadot) ? '✅' : '❌'}</li>
                  <li>Talisman: {(typeof window !== 'undefined' && (window as any).talisman) ? '✅' : '❌'}</li>
                  <li>SubWallet: {(typeof window !== 'undefined' && (window as any).subwallet) ? '✅' : '❌'}</li>
                  <li>Nova: {(typeof window !== 'undefined' && (window as any).nova) ? '✅' : '❌'}</li>
                </ul>
              </div>
            </div>
          </details>
        </div>
      </CardContent>
    </Card>
  );
};
