import { useState, useCallback, useMemo } from 'react';
import { usePolkadot } from '@/contexts/PolkadotContext';
import { ContractService, EventData, PoapData } from '@/services/contractService';
import { useToast } from '@/hooks/use-toast';

export interface UseContractReturn {
  // Service instance
  contractService: ContractService | null;
  
  // Loading states
  isLoading: boolean;
  isCreatingEvent: boolean;
  isMintingPoap: boolean;
  
  // Data
  events: EventData[];
  userPoaps: PoapData[];
  
  // Actions
  createEvent: (
    name: string,
    description: string,
    imageUri: string,
    startTime: number,
    endTime: number,
    maxCapacity: number
  ) => Promise<void>;
  
  mintPoap: (
    eventId: number,
    recipient: string,
    tokenUri: string
  ) => Promise<void>;
  
  activateEvent: (eventId: number) => Promise<void>;
  
  loadEvents: () => Promise<void>;
  loadUserPoaps: (userAddress?: string) => Promise<void>;
  loadEventPoaps: (eventId: number) => Promise<PoapData[]>;
  
  // Utilities
  refreshData: () => Promise<void>;
}

export const useContract = (): UseContractReturn => {
  const { api, contract, selectedAccount, isApiReady } = usePolkadot();
  const { toast } = useToast();
  
  // State
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [isMintingPoap, setIsMintingPoap] = useState(false);
  const [events, setEvents] = useState<EventData[]>([]);
  const [userPoaps, setUserPoaps] = useState<PoapData[]>([]);

  // Create contract service instance
  const contractService = useMemo(() => {
    if (!api || !contract || !isApiReady) return null;
    return new ContractService(api, contract);
  }, [api, contract, isApiReady]);

  // Create event
  const createEvent = useCallback(async (
    name: string,
    description: string,
    imageUri: string,
    startTime: number,
    endTime: number,
    maxCapacity: number
  ) => {
    if (!contractService || !selectedAccount) {
      toast({
        title: "Error",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingEvent(true);
    try {
      const txHash = await contractService.createEvent(
        selectedAccount,
        name,
        description,
        imageUri,
        startTime,
        endTime,
        maxCapacity
      );
      
      toast({
        title: "Success",
        description: "Event created successfully!",
      });
      
      // Refresh events list
      await loadEvents();
      
      console.log('Event created with tx hash:', txHash);
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create event",
        variant: "destructive",
      });
    } finally {
      setIsCreatingEvent(false);
    }
  }, [contractService, selectedAccount, toast]);

  // Mint POAP
  const mintPoap = useCallback(async (
    eventId: number,
    recipient: string,
    tokenUri: string
  ) => {
    if (!contractService || !selectedAccount) {
      toast({
        title: "Error",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    setIsMintingPoap(true);
    try {
      const txHash = await contractService.mintPoap(
        selectedAccount,
        eventId,
        recipient,
        tokenUri
      );
      
      toast({
        title: "Success",
        description: "POAP minted successfully!",
      });
      
      // Refresh user POAPs
      await loadUserPoaps();
      
      console.log('POAP minted with tx hash:', txHash);
    } catch (error) {
      console.error('Error minting POAP:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to mint POAP",
        variant: "destructive",
      });
    } finally {
      setIsMintingPoap(false);
    }
  }, [contractService, selectedAccount, toast]);

  // Activate event
  const activateEvent = useCallback(async (eventId: number) => {
    if (!contractService || !selectedAccount) {
      toast({
        title: "Error",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    try {
      const txHash = await contractService.activateEvent(selectedAccount, eventId);
      
      toast({
        title: "Success",
        description: "Event activated successfully!",
      });
      
      // Refresh events list
      await loadEvents();
      
      console.log('Event activated with tx hash:', txHash);
    } catch (error) {
      console.error('Error activating event:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to activate event",
        variant: "destructive",
      });
    }
  }, [contractService, selectedAccount, toast]);

  // Load all events
  const loadEvents = useCallback(async () => {
    if (!contractService) return;

    setIsLoading(true);
    try {
      const eventsData = await contractService.getAllEvents();
      setEvents(eventsData);
    } catch (error) {
      console.error('Error loading events:', error);
      toast({
        title: "Error",
        description: "Failed to load events",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [contractService, toast]);

  // Load user POAPs
  const loadUserPoaps = useCallback(async (userAddress?: string) => {
    if (!contractService) return;
    
    const address = userAddress || selectedAccount?.address;
    if (!address) return;

    setIsLoading(true);
    try {
      const poapsData = await contractService.getUserPoaps(address);
      setUserPoaps(poapsData);
    } catch (error) {
      console.error('Error loading user POAPs:', error);
      toast({
        title: "Error",
        description: "Failed to load POAPs",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [contractService, selectedAccount, toast]);

  // Load event POAPs
  const loadEventPoaps = useCallback(async (eventId: number): Promise<PoapData[]> => {
    if (!contractService) return [];

    try {
      return await contractService.getEventPoaps(eventId);
    } catch (error) {
      console.error('Error loading event POAPs:', error);
      toast({
        title: "Error",
        description: "Failed to load event POAPs",
        variant: "destructive",
      });
      return [];
    }
  }, [contractService, toast]);

  // Refresh all data
  const refreshData = useCallback(async () => {
    await Promise.all([
      loadEvents(),
      selectedAccount ? loadUserPoaps() : Promise.resolve(),
    ]);
  }, [loadEvents, loadUserPoaps, selectedAccount]);

  return {
    contractService,
    isLoading,
    isCreatingEvent,
    isMintingPoap,
    events,
    userPoaps,
    createEvent,
    mintPoap,
    activateEvent,
    loadEvents,
    loadUserPoaps,
    loadEventPoaps,
    refreshData,
  };
};
