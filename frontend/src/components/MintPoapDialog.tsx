import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Loader2, Award, Calendar, Users } from 'lucide-react';
import { useContract } from '@/hooks/useContract';
import { usePolkadot } from '@/contexts/PolkadotContext';
import { EventData } from '@/services/contractService';

// Form validation schema
const mintPoapSchema = z.object({
  recipient: z.string().min(1, 'Recipient address is required'),
  tokenUri: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

type MintPoapFormData = z.infer<typeof mintPoapSchema>;

interface MintPoapDialogProps {
  event: EventData;
  trigger?: React.ReactNode;
}

export const MintPoapDialog: React.FC<MintPoapDialogProps> = ({ event, trigger }) => {
  const [open, setOpen] = useState(false);
  const { selectedAccount, isWalletConnected } = usePolkadot();
  const { mintPoap, isMintingPoap } = useContract();

  const form = useForm<MintPoapFormData>({
    resolver: zodResolver(mintPoapSchema),
    defaultValues: {
      recipient: selectedAccount?.address || '',
      tokenUri: '',
    },
  });

  // Update recipient when account changes
  React.useEffect(() => {
    if (selectedAccount?.address) {
      form.setValue('recipient', selectedAccount.address);
    }
  }, [selectedAccount, form]);

  const onSubmit = async (data: MintPoapFormData) => {
    if (!isWalletConnected || !selectedAccount) {
      return;
    }

    try {
      await mintPoap(
        event.id,
        data.recipient,
        data.tokenUri || `ipfs://default-poap-metadata/${event.id}` // Default metadata URI
      );

      // Reset form and close dialog on success
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error('Error minting POAP:', error);
    }
  };

  const canMint = event.isActive && event.totalMinted < event.maxCapacity;
  const isEventEnded = Date.now() > event.endTime * 1000;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button 
            variant="default" 
            disabled={!isWalletConnected || !canMint}
            className="w-full"
          >
            <Award className="mr-2 h-4 w-4" />
            {!isWalletConnected ? "Connect Wallet" : 
             !canMint ? "Minting Closed" : 
             "Mint POAP"}
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Mint POAP
          </DialogTitle>
          <DialogDescription>
            Mint a Proof of Attendance Protocol token for this event
          </DialogDescription>
        </DialogHeader>

        {/* Event Info */}
        <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium">{event.name}</h4>
          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{new Date(event.startTime * 1000).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{event.totalMinted}/{event.maxCapacity}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant={event.isActive ? "default" : "secondary"}>
              {event.isActive ? "Active" : "Inactive"}
            </Badge>
            {isEventEnded && (
              <Badge variant="outline">Event Ended</Badge>
            )}
          </div>
        </div>

        {/* Minting Form */}
        {isWalletConnected ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Recipient Address */}
              <FormField
                control={form.control}
                name="recipient"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recipient Address</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter recipient address"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The address that will receive the POAP token
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Token URI (Optional) */}
              <FormField
                control={form.control}
                name="tokenUri"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Metadata URI (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="ipfs://... or https://..."
                        type="url"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Custom metadata URI for this POAP. Leave empty for default.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Mint Button */}
              <div className="flex gap-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isMintingPoap || !canMint}
                  className="flex-1"
                >
                  {isMintingPoap ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Minting...
                    </>
                  ) : (
                    <>
                      <Award className="mr-2 h-4 w-4" />
                      Mint POAP
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">
              Please connect your wallet to mint a POAP
            </p>
            <Button onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
