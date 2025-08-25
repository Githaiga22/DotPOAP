import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Separator } from './ui/separator';
import { Wallet, AlertCircle, CheckCircle, Loader2, ExternalLink, Copy, Check, LogOut } from 'lucide-react';
import { usePolkadot } from '@/contexts/PolkadotContext';
import { WalletInstallHelper } from "./WalletInstallHelper";
import { hasAnyWallet } from "@/utils/walletDetection";

// Wallet information for the selection modal
const SUPPORTED_WALLETS = [
  {
    id: 'polkadot-js',
    name: 'Polkadot.js Extension',
    description: 'The official Polkadot browser extension',
    icon: '🔗',
    downloadUrl: 'https://polkadot.js.org/extension/',
    isInstalled: () => {
      // Check multiple injection patterns for Polkadot.js
      return !!(window as any).injectedWeb3?.['polkadot-js'] || 
             !!(window as any).polkadot;
    }
  },
  {
    id: 'talisman',
    name: 'Talisman',
    description: 'A beautiful wallet for Polkadot & Ethereum',
    icon: '🔮',
    downloadUrl: 'https://talisman.xyz/',
    isInstalled: () => {
      // Check multiple injection patterns for Talisman
      return !!(window as any).injectedWeb3?.talisman || 
             !!(window as any).talisman;
    }
  },
  {
    id: 'subwallet-js',
    name: 'SubWallet',
    description: 'The comprehensive non-custodial wallet',
    icon: '🌟',
    downloadUrl: 'https://subwallet.app/',
    isInstalled: () => {
      // Check multiple injection patterns for SubWallet
      return !!(window as any).injectedWeb3?.['subwallet-js'] || 
             !!(window as any).subwallet;
    }
  },
  {
    id: 'nova-wallet',
    name: 'Nova Wallet',
    description: 'Next-gen wallet for Polkadot ecosystem',
    icon: '⭐',
    downloadUrl: 'https://novawallet.io/',
    isInstalled: () => {
      // Check multiple injection patterns for Nova Wallet
      return !!(window as any).injectedWeb3?.['nova-wallet'] || 
             !!(window as any).nova;
    }
  }
];

export const WalletConnection: React.FC = () => {
  const {
    accounts,
    selectedAccount,
    isWalletConnected,
    walletError,
    isApiReady,
    apiError,
    connectWallet,
    disconnectWallet,
    selectAccount,
    reconnectApi,
  } = usePolkadot();

  const [isConnecting, setIsConnecting] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  const walletsAvailable = hasAnyWallet();

  // Format address for display
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  // Get account name or formatted address
  const getAccountDisplayName = (account: any) => {
    return account.meta?.name || formatAddress(account.address);
  };

  // Handle wallet connection with loading state
  const handleConnectWallet = async () => {
    setIsConnecting(true);
    try {
      await connectWallet();
      setShowWalletModal(false);
    } catch (error) {
      console.error('Wallet connection failed:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  // Copy address to clipboard
  const copyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    } catch (error) {
      console.error('Failed to copy address:', error);
    }
  };

  // Show wallet installation helper if no wallets are available
  if (!walletsAvailable) {
    return <WalletInstallHelper />;
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Wallet Connection
        </CardTitle>
        <CardDescription>
          Connect your Polkadot wallet to interact with DotPOAP
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* API Connection Status */}
        <div className="flex items-center gap-2">
          {isApiReady ? (
            <>
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-600">Connected to Asset Hub Paseo</span>
            </>
          ) : apiError ? (
            <>
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm text-red-600">Network connection failed</span>
            </>
          ) : (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />
              <span className="text-sm text-yellow-600">Connecting to Asset Hub Paseo...</span>
            </>
          )}
        </div>

        {/* API Error */}
        {apiError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Network Error: {apiError}
              <Button
                variant="outline"
                size="sm"
                className="ml-2"
                onClick={reconnectApi}
              >
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Wallet Connection */}
        {!isWalletConnected ? (
          <div className="space-y-3">
            <Dialog open={showWalletModal} onOpenChange={setShowWalletModal}>
              <DialogTrigger asChild>
                <Button
                  className="w-full"
                  disabled={!isApiReady}
                  size="lg"
                >
                  <Wallet className="mr-2 h-4 w-4" />
                  Connect Wallet
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5" />
                    Connect Wallet
                  </DialogTitle>
                  <DialogDescription>
                    Choose a wallet to connect to DotPOAP. Make sure you have one of the supported wallet extensions installed.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  {/* Wallet Options */}
                  <div className="space-y-2">
                    {SUPPORTED_WALLETS.map((wallet) => {
                      const isInstalled = wallet.isInstalled();
                      return (
                        <div key={wallet.id} className="relative">
                          <Button
                            variant={isInstalled ? "outline" : "ghost"}
                            className={`w-full justify-start h-auto p-4 ${
                              isInstalled
                                ? "border-primary/20 hover:border-primary/40"
                                : "opacity-50 cursor-not-allowed"
                            }`}
                            onClick={isInstalled ? handleConnectWallet : undefined}
                            disabled={!isInstalled || isConnecting}
                          >
                            <div className="flex items-center gap-3 w-full">
                              <div className="text-2xl">{wallet.icon}</div>
                              <div className="flex-1 text-left">
                                <div className="font-medium">{wallet.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {wallet.description}
                                </div>
                              </div>
                              {isInstalled ? (
                                <Badge variant="secondary" className="text-xs">
                                  Installed
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-xs">
                                  Not Installed
                                </Badge>
                              )}
                            </div>
                          </Button>

                          {!isInstalled && (
                            <a
                              href={wallet.downloadUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="absolute inset-0 flex items-center justify-center bg-background/80 hover:bg-background/90 transition-colors rounded-md"
                            >
                              <div className="flex items-center gap-2 text-sm text-primary">
                                <ExternalLink className="h-4 w-4" />
                                Install {wallet.name}
                              </div>
                            </a>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {isConnecting && (
                    <div className="flex items-center justify-center gap-2 py-4">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Connecting to wallet...</span>
                    </div>
                  )}

                  <Separator />

                  <div className="text-xs text-muted-foreground">
                    <p className="mb-2">
                      <strong>New to Polkadot wallets?</strong>
                    </p>
                    <p>
                      We recommend starting with the Polkadot.js Extension for beginners,
                      or Talisman for a more feature-rich experience.
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {walletError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="whitespace-pre-line">{walletError}</AlertDescription>
              </Alert>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Connected Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600 font-medium">Wallet Connected</span>
              </div>
              <Badge variant="secondary">{accounts.length} account(s)</Badge>
            </div>

            {/* Account Selection */}
            {accounts.length > 1 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Account:</label>
                <Select
                  value={selectedAccount?.address}
                  onValueChange={(address) => {
                    const account = accounts.find(acc => acc.address === address);
                    if (account) selectAccount(account);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((account) => (
                      <SelectItem key={account.address} value={account.address}>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {getAccountDisplayName(account).slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="text-sm">{getAccountDisplayName(account)}</span>
                            <span className="text-xs text-muted-foreground">
                              {formatAddress(account.address)}
                            </span>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Selected Account Info */}
            {selectedAccount && (
              <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {getAccountDisplayName(selectedAccount).slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm">
                        {getAccountDisplayName(selectedAccount)}
                      </div>
                      <div className="text-xs text-muted-foreground font-mono flex items-center gap-2">
                        <span>{formatAddress(selectedAccount.address)}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-transparent"
                          onClick={() => copyAddress(selectedAccount.address)}
                        >
                          {copiedAddress ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={disconnectWallet}
                className="flex-1"
                size="sm"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Disconnect
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowWalletModal(true)}
                className="flex-1"
                size="sm"
              >
                <Wallet className="mr-2 h-4 w-4" />
                Switch Wallet
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
