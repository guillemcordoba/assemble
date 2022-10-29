use hdi::prelude::*;
#[hdk_entry_helper]
#[derive(Clone)]
pub struct Fulfillment {
    pub commitment_hash: ActionHash,
    pub fullfilled: bool,
    pub promise_hash: ActionHash,
    pub reflection: String,
}
