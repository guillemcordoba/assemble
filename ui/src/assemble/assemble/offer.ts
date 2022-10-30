import { Record, ActionHash, EntryHash, AgentPubKey } from '@holochain/client';

export interface Slot {
  title: string;
  description: string;
  required: boolean
}

export interface Offer { 
  description: string;

  title: string;
  
  slots: Array<Slot>;
}
