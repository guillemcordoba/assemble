import { Record, ActionHash, EntryHash, AgentPubKey } from '@holochain/client';

export interface Promise { 
  offer_hash: ActionHash;
  commitment_hashes: Array<ActionHash>;
}
