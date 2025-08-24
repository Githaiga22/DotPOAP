import { ApiPromise } from '@polkadot/api';
import { ContractPromise } from '@polkadot/api-contract';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { web3FromAddress } from '@polkadot/extension-dapp';
import { POLKADOT_CONFIG } from '@/config/polkadot';
import { AnyJson } from '@polkadot/types/types';

// Types for contract interactions
export interface EventData {
  id: number;
  name: string;
  description: string;
  imageUri: string;
  startTime: number;
  endTime: number;
  maxCapacity: number;
  isActive: boolean;
  organizer: string;
  totalMinted: number;
}

export interface PoapData {
  id: number;
  eventId: number;
  owner: string;
  tokenUri: string;
  mintedAt: number;
}

export interface ContractError {
  message: string;
  code?: string;
}

export class ContractService {
  private api: ApiPromise;
  private contract: ContractPromise;

  constructor(api: ApiPromise, contract: ContractPromise) {
    this.api = api;
    this.contract = contract;
  }

  // Helper method to get signer from account
  private async getSigner(account: InjectedAccountWithMeta) {
    const injector = await web3FromAddress(account.address);
    return injector.signer;
  }

  // Helper method to handle contract call results
  private handleContractResult(result: any) {
    if (result.isErr) {
      throw new Error(`Contract error: ${result.asErr.toString()}`);
    }
    return result.asOk;
  }

  // Helper method to safely parse contract output
  private safeParseOutput(output: any): any {
    if (!output) return null;
    const data = output.toHuman();
    return data;
  }

  // Helper method to safely check if data is an array
  private isArray(data: any): data is any[] {
    return Array.isArray(data);
  }

  // Read-only contract calls (queries)
  
  async getEvent(eventId: number): Promise<EventData | null> {
    try {
      const { result, output } = await this.contract.query.getEvent(
        '', // caller address (empty for queries)
        {
          gasLimit: POLKADOT_CONFIG.CONTRACT.gasLimit.read,
        },
        eventId
      );

      if (result.isErr) {
        console.error('Query failed:', result.asErr);
        return null;
      }

      const data = this.safeParseOutput(output);
      return data ? this.parseEventData(data) : null;
    } catch (error) {
      console.error('Error getting event:', error);
      throw error;
    }
  }

  async getAllEvents(): Promise<EventData[]> {
    try {
      const { result, output } = await this.contract.query.getAllEvents(
        '',
        {
          gasLimit: POLKADOT_CONFIG.CONTRACT.gasLimit.read,
        }
      );

      if (result.isErr) {
        console.error('Query failed:', result.asErr);
        return [];
      }

      const data = this.safeParseOutput(output);
      if (data && this.isArray(data)) {
        return data.map((event: any) => this.parseEventData(event));
      }
      return [];
    } catch (error) {
      console.error('Error getting all events:', error);
      throw error;
    }
  }

  async getUserPoaps(userAddress: string): Promise<PoapData[]> {
    try {
      const { result, output } = await this.contract.query.getUserPoaps(
        '',
        {
          gasLimit: POLKADOT_CONFIG.CONTRACT.gasLimit.read,
        },
        userAddress
      );

      if (result.isErr) {
        console.error('Query failed:', result.asErr);
        return [];
      }

      const data = this.safeParseOutput(output);
      if (data && this.isArray(data)) {
        return data.map((poap: any) => this.parsePoapData(poap));
      }
      return [];
    } catch (error) {
      console.error('Error getting user POAPs:', error);
      throw error;
    }
  }

  async getEventPoaps(eventId: number): Promise<PoapData[]> {
    try {
      const { result, output } = await this.contract.query.getEventPoaps(
        '',
        {
          gasLimit: POLKADOT_CONFIG.CONTRACT.gasLimit.read,
        },
        eventId
      );

      if (result.isErr) {
        console.error('Query failed:', result.asErr);
        return [];
      }

      const data = this.safeParseOutput(output);
      if (data && this.isArray(data)) {
        return data.map((poap: any) => this.parsePoapData(poap));
      }
      return [];
    } catch (error) {
      console.error('Error getting event POAPs:', error);
      throw error;
    }
  }

  // Write contract calls (transactions)

  async createEvent(
    account: InjectedAccountWithMeta,
    name: string,
    description: string,
    imageUri: string,
    startTime: number,
    endTime: number,
    maxCapacity: number
  ): Promise<string> {
    try {
      const signer = await this.getSigner(account);

      const tx = this.contract.tx.createEvent(
        {
          gasLimit: POLKADOT_CONFIG.CONTRACT.gasLimit.write,
        },
        name,
        description,
        imageUri,
        startTime,
        endTime,
        maxCapacity
      );

      return new Promise((resolve, reject) => {
        tx.signAndSend(account.address, { signer: signer as any }, (result) => {
          if (result.status.isInBlock) {
            console.log('Transaction in block:', result.status.asInBlock.toString());
          } else if (result.status.isFinalized) {
            console.log('Transaction finalized:', result.status.asFinalized.toString());
            resolve(result.status.asFinalized.toString());
          } else if (result.isError) {
            reject(new Error('Transaction failed'));
          }
        }).catch(reject);
      });
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  }

  async mintPoap(
    account: InjectedAccountWithMeta,
    eventId: number,
    recipient: string,
    tokenUri: string
  ): Promise<string> {
    try {
      const signer = await this.getSigner(account);

      const tx = this.contract.tx.mintPoap(
        {
          gasLimit: POLKADOT_CONFIG.CONTRACT.gasLimit.write,
        },
        eventId,
        recipient,
        tokenUri
      );

      return new Promise((resolve, reject) => {
        tx.signAndSend(account.address, { signer: signer as any }, (result) => {
          if (result.status.isInBlock) {
            console.log('Transaction in block:', result.status.asInBlock.toString());
          } else if (result.status.isFinalized) {
            console.log('Transaction finalized:', result.status.asFinalized.toString());
            resolve(result.status.asFinalized.toString());
          } else if (result.isError) {
            reject(new Error('Transaction failed'));
          }
        }).catch(reject);
      });
    } catch (error) {
      console.error('Error minting POAP:', error);
      throw error;
    }
  }

  async activateEvent(account: InjectedAccountWithMeta, eventId: number): Promise<string> {
    try {
      const signer = await this.getSigner(account);

      const tx = this.contract.tx.activateEvent(
        {
          gasLimit: POLKADOT_CONFIG.CONTRACT.gasLimit.write,
        },
        eventId
      );

      return new Promise((resolve, reject) => {
        tx.signAndSend(account.address, { signer: signer as any }, (result) => {
          if (result.status.isFinalized) {
            resolve(result.status.asFinalized.toString());
          } else if (result.isError) {
            reject(new Error('Transaction failed'));
          }
        }).catch(reject);
      });
    } catch (error) {
      console.error('Error activating event:', error);
      throw error;
    }
  }

  // Helper methods for parsing contract data
  private parseEventData(data: any): EventData {
    return {
      id: parseInt(data.id),
      name: data.name,
      description: data.description,
      imageUri: data.imageUri,
      startTime: parseInt(data.startTime),
      endTime: parseInt(data.endTime),
      maxCapacity: parseInt(data.maxCapacity),
      isActive: data.isActive,
      organizer: data.organizer,
      totalMinted: parseInt(data.totalMinted),
    };
  }

  private parsePoapData(data: any): PoapData {
    return {
      id: parseInt(data.id),
      eventId: parseInt(data.eventId),
      owner: data.owner,
      tokenUri: data.tokenUri,
      mintedAt: parseInt(data.mintedAt),
    };
  }
}
