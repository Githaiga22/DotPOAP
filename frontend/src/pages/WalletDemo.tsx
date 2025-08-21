import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Wallet, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  ExternalLink,
  Code,
  Zap,
  Shield,
  Users
} from 'lucide-react';
import { WalletConnectButton } from '@/components/WalletConnectButton';
import { WalletConnection } from '@/components/WalletConnection';
import { ConnectionStatus } from '@/components/ConnectionStatus';
import { usePolkadot } from '@/contexts/PolkadotContext';

const WalletDemo: React.FC = () => {
  const { isWalletConnected, selectedAccount, accounts, isApiReady } = usePolkadot();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Wallet Connection Demo
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the enhanced Polkadot.js wallet integration similar to the official Polkadot.js Apps interface
          </p>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Zap className="h-4 w-4 text-blue-500" />
                Network Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {isApiReady ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600">Connected to Asset Hub Paseo</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-yellow-600">Connecting...</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Wallet className="h-4 w-4 text-purple-500" />
                Wallet Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {isWalletConnected ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600">Wallet Connected</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Not Connected</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4 text-green-500" />
                Accounts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {accounts.length} account(s)
                </Badge>
                {selectedAccount && (
                  <span className="text-xs text-muted-foreground">
                    {selectedAccount.meta?.name || 'Selected'}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Demo Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Wallet Connection Components */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Header Wallet Button
                </CardTitle>
                <CardDescription>
                  This is the compact wallet button used in the navigation header
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <WalletConnectButton variant="default" />
                  <WalletConnectButton variant="outline" />
                  <WalletConnectButton variant="ghost" />
                </div>
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    The button automatically adapts based on wallet connection status. 
                    When connected, it shows an account dropdown with switching capabilities.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Full Wallet Connection Panel
                </CardTitle>
                <CardDescription>
                  Complete wallet connection interface with detailed status and controls
                </CardDescription>
              </CardHeader>
              <CardContent>
                <WalletConnection />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Technical Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Technical Details
                </CardTitle>
                <CardDescription>
                  Implementation details and supported features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Supported Wallets</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span>🔗</span>
                        <span>Polkadot.js Extension</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>🔮</span>
                        <span>Talisman</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>🌟</span>
                        <span>SubWallet</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>⭐</span>
                        <span>Nova Wallet</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-sm mb-2">Key Features</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Modal-based wallet selection</li>
                      <li>• Automatic wallet detection</li>
                      <li>• Multi-account support</li>
                      <li>• Account switching</li>
                      <li>• Connection status indicators</li>
                      <li>• Error handling & retry logic</li>
                      <li>• Responsive design</li>
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-sm mb-2">Network Configuration</h4>
                    <div className="text-sm space-y-1 text-muted-foreground">
                      <div>Network: Asset Hub Paseo Testnet</div>
                      <div>Contract: 0xcB3d59D424bCD9D8d58C5F4926D011252C3C1363</div>
                      <div>Multiple RPC endpoints with fallback</div>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button variant="outline" size="sm" asChild>
                    <a 
                      href="https://polkadot.js.org/apps/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Compare with Polkadot.js Apps
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Connection Metrics
                </CardTitle>
                <CardDescription>
                  Real-time connection monitoring and debugging
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ConnectionStatus />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            This demo showcases the enhanced wallet connection flow for DotPOAP, 
            designed to match the user experience of the official Polkadot.js Apps interface.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WalletDemo;
