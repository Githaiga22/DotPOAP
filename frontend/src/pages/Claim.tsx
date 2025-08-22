import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Award, 
  Calendar, 
  Users, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  QrCode,
  ArrowRight,
  Gift
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { WalletConnection } from '@/components/WalletConnection';
import { usePolkadot } from '@/contexts/PolkadotContext';
import { useContract } from '@/hooks/useContract';

const Claim = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [claimCode, setClaimCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [claimStatus, setClaimStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [eventData, setEventData] = useState<any>(null);

  const { isWalletConnected, selectedAccount } = usePolkadot();
  const { mintPoap, events, loadEvents } = useContract();

  // Get parameters from URL
  const eventId = searchParams.get('eventId');
  const urlClaimCode = searchParams.get('code');

  useEffect(() => {
    if (urlClaimCode) {
      setClaimCode(urlClaimCode);
    }
  }, [urlClaimCode]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  useEffect(() => {
    if (eventId && events.length > 0) {
      const event = events.find(e => e.id.toString() === eventId);
      setEventData(event);
    }
  }, [eventId, events]);

  const handleClaim = async () => {
    if (!isWalletConnected || !selectedAccount || !eventData) {
      return;
    }

    setIsLoading(true);
    setClaimStatus('idle');
    setErrorMessage('');

    try {
      // In a real implementation, you would validate the claim code here
      // For now, we'll just mint the POAP directly
      await mintPoap(
        eventData.id,
        selectedAccount.address,
        `ipfs://default-poap-metadata/${eventData.id}`
      );

      setClaimStatus('success');
      
      // Redirect to My POAPs after successful claim
      setTimeout(() => {
        navigate('/my-poaps');
      }, 3000);
    } catch (error) {
      console.error('Error claiming POAP:', error);
      setClaimStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to claim POAP');
    } finally {
      setIsLoading(false);
    }
  };

  const canClaim = () => {
    if (!eventData) return false;
    if (!eventData.isActive) return false;
    if (eventData.totalMinted >= eventData.maxCapacity) return false;
    if (Date.now() > eventData.endTime * 1000) return false;
    return true;
  };

  if (!eventId) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto text-center">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Invalid claim link. Please check the URL and try again.
              </AlertDescription>
            </Alert>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading event details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Claim Your POAP</h1>
            <p className="text-muted-foreground">
              You've been invited to claim a Proof of Attendance Protocol token
            </p>
          </div>

          {/* Event Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                {eventData.name}
              </CardTitle>
              <CardDescription>{eventData.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{new Date(eventData.startTime * 1000).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{eventData.totalMinted}/{eventData.maxCapacity} claimed</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={eventData.isActive ? "default" : "secondary"}>
                    {eventData.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Claim Status Messages */}
          {claimStatus === 'success' && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                🎉 Congratulations! Your POAP has been successfully claimed. 
                Redirecting to your collection...
              </AlertDescription>
            </Alert>
          )}

          {claimStatus === 'error' && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          {!canClaim() && claimStatus === 'idle' && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {!eventData.isActive && "This event is not currently active."}
                {eventData.totalMinted >= eventData.maxCapacity && "All POAPs for this event have been claimed."}
                {Date.now() > eventData.endTime * 1000 && "The claiming period for this event has ended."}
              </AlertDescription>
            </Alert>
          )}

          {/* Wallet Connection */}
          {!isWalletConnected ? (
            <Card>
              <CardHeader>
                <CardTitle>Connect Your Wallet</CardTitle>
                <CardDescription>
                  Connect your Polkadot wallet to claim your POAP
                </CardDescription>
              </CardHeader>
              <CardContent>
                <WalletConnection />
              </CardContent>
            </Card>
          ) : (
            /* Claim Interface */
            <Card>
              <CardHeader>
                <CardTitle>Claim Your POAP</CardTitle>
                <CardDescription>
                  {urlClaimCode 
                    ? "Your claim code has been automatically filled in"
                    : "Enter your claim code to proceed"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Connected Account */}
                <div className="p-4 bg-muted/50 rounded-lg">
                  <Label className="text-sm font-medium">Connected Account</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedAccount?.meta.name || 'Unnamed Account'}
                  </p>
                  <p className="font-mono text-sm">
                    {selectedAccount?.address.slice(0, 8)}...{selectedAccount?.address.slice(-8)}
                  </p>
                </div>

                {/* Claim Code Input */}
                {!urlClaimCode && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="claimCode">Claim Code</Label>
                      <Input
                        id="claimCode"
                        value={claimCode}
                        onChange={(e) => setClaimCode(e.target.value.toUpperCase())}
                        placeholder="Enter your 8-character claim code"
                        className="font-mono text-lg tracking-wider text-center"
                        maxLength={8}
                      />
                    </div>

                    <Separator />

                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">
                        Don't have a claim code?
                      </p>
                      <Button variant="outline" size="sm">
                        <QrCode className="h-4 w-4 mr-2" />
                        Scan QR Code
                      </Button>
                    </div>
                  </>
                )}

                {/* Claim Button */}
                <Button
                  onClick={handleClaim}
                  disabled={isLoading || !canClaim() || claimStatus === 'success' || (!urlClaimCode && claimCode.length !== 8)}
                  className="w-full"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Claiming POAP...
                    </>
                  ) : claimStatus === 'success' ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      POAP Claimed!
                    </>
                  ) : (
                    <>
                      <Award className="h-4 w-4 mr-2" />
                      Claim POAP
                    </>
                  )}
                </Button>

                {claimStatus === 'success' && (
                  <div className="text-center">
                    <Button variant="outline" onClick={() => navigate('/my-poaps')}>
                      View My Collection
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Help Section */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• Make sure you have a Polkadot-compatible wallet installed</p>
              <p>• Check that your claim code is correct (8 characters)</p>
              <p>• Ensure the event is still active and has available POAPs</p>
              <p>• Contact the event organizer if you continue to have issues</p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Claim;
