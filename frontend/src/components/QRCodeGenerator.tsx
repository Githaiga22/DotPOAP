import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { QrCode, Download, Copy, RefreshCw, Share2, Info } from 'lucide-react';
import { EventData } from '@/services/contractService';

interface QRCodeGeneratorProps {
  event: EventData;
  className?: string;
}

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ event, className }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [claimCode, setClaimCode] = useState<string>('');
  const [customMessage, setCustomMessage] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate claim URL for the event
  const generateClaimUrl = (code?: string) => {
    const baseUrl = window.location.origin;
    const eventId = event.id;
    const params = new URLSearchParams({
      eventId: eventId.toString(),
      ...(code && { code })
    });
    return `${baseUrl}/claim?${params.toString()}`;
  };

  // Generate QR code using a QR code API service
  const generateQRCode = async (data: string, size: number = 300) => {
    try {
      setIsGenerating(true);
      // Using QR Server API (free service)
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}&format=png&margin=10`;
      setQrCodeUrl(qrUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate random claim code
  const generateClaimCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  // Initialize with direct claim URL
  useEffect(() => {
    const directUrl = generateClaimUrl();
    generateQRCode(directUrl);
  }, [event.id]);

  const handleGenerateWithCode = () => {
    const newCode = generateClaimCode();
    setClaimCode(newCode);
    const urlWithCode = generateClaimUrl(newCode);
    generateQRCode(urlWithCode);
  };

  const handleCopyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const handleDownloadQR = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.href = qrCodeUrl;
      link.download = `dotpoap-event-${event.id}-qr.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const directClaimUrl = generateClaimUrl();
  const codeClaimUrl = claimCode ? generateClaimUrl(claimCode) : '';

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5" />
          QR Code & Distribution
        </CardTitle>
        <CardDescription>
          Generate QR codes and claim links for easy POAP distribution
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="direct" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="direct">Direct Claim</TabsTrigger>
            <TabsTrigger value="code">Claim Code</TabsTrigger>
          </TabsList>
          
          <TabsContent value="direct" className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Direct claim allows anyone with the QR code to mint a POAP for this event
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              {/* QR Code Display */}
              <div className="flex justify-center">
                <div className="relative">
                  {isGenerating ? (
                    <div className="w-64 h-64 bg-muted rounded-lg flex items-center justify-center">
                      <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <img
                      src={qrCodeUrl}
                      alt="QR Code for POAP Claim"
                      className="w-64 h-64 rounded-lg border border-border"
                    />
                  )}
                </div>
              </div>
              
              {/* Claim URL */}
              <div className="space-y-2">
                <Label>Claim URL</Label>
                <div className="flex gap-2">
                  <Input
                    value={directClaimUrl}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleCopyToClipboard(directClaimUrl)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex gap-2">
                <Button onClick={handleDownloadQR} className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download QR
                </Button>
                <Button variant="outline" className="flex-1">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="code" className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Claim codes provide more control over distribution and can be shared individually
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              {/* Generate Claim Code */}
              <div className="space-y-2">
                <Label>Claim Code</Label>
                <div className="flex gap-2">
                  <Input
                    value={claimCode}
                    readOnly
                    placeholder="Click generate to create a claim code"
                    className="font-mono text-lg tracking-wider"
                  />
                  <Button onClick={handleGenerateWithCode}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Generate
                  </Button>
                </div>
              </div>
              
              {claimCode && (
                <>
                  {/* QR Code for Claim Code */}
                  <div className="flex justify-center">
                    <div className="relative">
                      <img
                        src={qrCodeUrl}
                        alt="QR Code for Claim Code"
                        className="w-64 h-64 rounded-lg border border-border"
                      />
                      <Badge className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                        Code: {claimCode}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Claim URL with Code */}
                  <div className="space-y-2">
                    <Label>Claim URL with Code</Label>
                    <div className="flex gap-2">
                      <Input
                        value={codeClaimUrl}
                        readOnly
                        className="font-mono text-sm"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleCopyToClipboard(codeClaimUrl)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button onClick={handleDownloadQR} className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Download QR
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleCopyToClipboard(claimCode)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Code
                    </Button>
                  </div>
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Event Info */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium mb-2">Event Details</h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <p><strong>Event:</strong> {event.name}</p>
            <p><strong>Event ID:</strong> #{event.id}</p>
            <p><strong>Capacity:</strong> {event.totalMinted}/{event.maxCapacity}</p>
            <p><strong>Status:</strong> {event.isActive ? 'Active' : 'Inactive'}</p>
          </div>
        </div>
        
        {/* Distribution Tips */}
        <div className="mt-4 space-y-2">
          <Label className="text-sm font-medium">Distribution Tips:</Label>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Display QR codes at event entrances or registration</li>
            <li>• Share claim codes via email or messaging apps</li>
            <li>• Print QR codes on event materials or badges</li>
            <li>• Use claim codes for controlled distribution</li>
            <li>• Monitor minting progress in real-time</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
