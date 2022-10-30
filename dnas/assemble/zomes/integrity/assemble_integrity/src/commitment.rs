use hdi::prelude::*;

use crate::Slot;

#[hdk_entry_helper]
#[derive(Clone)]
pub struct Commitment {
    pub offer_or_commitment_hash: ActionHash,
    pub fulfulling_slot_index: u8,
    pub slots: Vec<Slot>,
}
