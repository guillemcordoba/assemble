import { Record, ActionHash, EntryHash, AgentPubKey } from '@holochain/client';
import { Slot } from './offer';

export interface Commitment { 
  offer_hash: ActionHash;
  slots: Array<Slot>
}
