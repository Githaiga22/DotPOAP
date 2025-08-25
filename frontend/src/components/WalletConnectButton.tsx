import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Separator } from './ui/separator';
import { Wallet, AlertCircle, CheckCircle, Loader2, ExternalLink, Copy, Check, LogOut, ChevronDown, User } from 'lucide-react';
import { usePolkadot } from '@/contexts/PolkadotContext';
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

interface WalletConnectButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export const WalletConnectButton: React.FC<WalletConnectButtonProps> = ({ 
  variant = 'default', 
  size = 'default',
  className = ''
}) => {
  const {
    accounts,
    selectedAccount,
    isWalletConnected,
    walletError,
    isApiReady,
    connectWallet,
    disconnectWallet,
    selectAccount,
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

  // If no wallets available, show install prompt
  if (!walletsAvailable) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant={variant} size={size} className={className}>
            <Wallet className="mr-2 h-4 w-4" />
            Connect Wallet
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              No Wallet Found
            </DialogTitle>
            <DialogDescription>
              You need to install a Polkadot wallet extension to connect.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              {SUPPORTED_WALLETS.map((wallet) => (
                <a
                  key={wallet.id}
                  href={wallet.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="text-2xl">{wallet.icon}</div>
                  <div className="flex-1">
                    <div className="font-medium">{wallet.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {wallet.description}
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </a>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // If wallet is connected, show account dropdown
  if (isWalletConnected && selectedAccount) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={variant} size={size} className={`${className} gap-2`}>
            <Avatar className="h-5 w-5">
              <AvatarFallback className="text-xs">
                {getAccountDisplayName(selectedAccount).slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="hidden sm:inline">
              {getAccountDisplayName(selectedAccount)}
            </span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <div className="px-3 py-2">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Connected</span>
              <Badge variant="secondary" className="text-xs">
                {accounts.length} account(s)
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground font-mono flex items-center gap-2">
              <span>{selectedAccount.address}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0"
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
          
          <DropdownMenuSeparator />
          
          {accounts.length > 1 && (
            <>
              <div className="px-3 py-1">
                <span className="text-xs font-medium text-muted-foreground">Switch Account</span>
              </div>
              {accounts.map((account) => (
                <DropdownMenuItem
                  key={account.address}
                  onClick={() => selectAccount(account)}
                  className={`gap-2 ${
                    selectedAccount.address === account.address ? 'bg-muted' : ''
                  }`}
                >
                  <Avatar className="h-5 w-5">
                    <AvatarFallback className="text-xs">
                      {getAccountDisplayName(account).slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm">{getAccountDisplayName(account)}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatAddress(account.address)}
                    </div>
                  </div>
                  {selectedAccount.address === account.address && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
            </>
          )}
          
          <DropdownMenuItem onClick={() => setShowWalletModal(true)}>
            <Wallet className="mr-2 h-4 w-4" />
            Switch Wallet
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={disconnectWallet} className="text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Show connect wallet button
  return (
    <Dialog open={showWalletModal} onOpenChange={setShowWalletModal}>
      <DialogTrigger asChild>
        <Button 
          variant={variant} 
          size={size} 
          className={className}
          disabled={!isApiReady}
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
  );
};
