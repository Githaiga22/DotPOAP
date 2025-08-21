import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { CheckCircle, Download, ExternalLink, RefreshCw, AlertCircle } from 'lucide-react';
import { detectWallets, getWalletRecommendations, waitForWalletInjection, type WalletInfo } from '@/utils/walletDetection';

export const WalletInstallHelper: React.FC = () => {
  const [wallets, setWallets] = useState<WalletInfo[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const refreshWalletStatus = async () => {
    setIsChecking(true);
    
    // Wait a bit for any async wallet injections
    await waitForWalletInjection(1000);
    
    const detectedWallets = detectWallets();
    setWallets(detectedWallets);
    setLastCheck(new Date());
    setIsChecking(false);
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

        {/* Browser Compatibility Note */}
        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground">
            <strong>Note:</strong> Wallet extensions work in desktop browsers (Chrome, Firefox, Edge). 
            Mobile users should use wallet apps with built-in browsers.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
