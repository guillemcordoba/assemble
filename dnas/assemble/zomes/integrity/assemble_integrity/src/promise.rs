use hdi::prelude::*;
#[hdk_entry_helper]
#[derive(Clone)]
pub struct Promise {
    pub offer_hash: ActionHash,
}
