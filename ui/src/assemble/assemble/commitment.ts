import { Record, ActionHash, EntryHash, AgentPubKey } from '@holochain/client';
import { Slot } from './offer';

export interface Commitment { 
  offer_or_commitment_hash: ActionHash;
  fulfilling_slot_index: number;
  slots: Array<Slot>
}
