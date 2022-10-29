import { Record, ActionHash, EntryHash, AgentPubKey } from '@holochain/client';

export interface Fulfillment { 
  commitment_hash: ActionHash
;

  fullfilled: boolean
;

  promise_hash: ActionHash
;

  reflection: string
;
}
