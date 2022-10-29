use hdi::prelude::*;
#[hdk_entry_helper]
#[derive(Clone)]
pub struct Commitment {
    pub offer_hash: ActionHash,
}
