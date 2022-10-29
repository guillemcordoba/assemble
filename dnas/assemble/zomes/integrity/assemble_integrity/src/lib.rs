pub mod fulfillment;
pub use fulfillment::*;
pub mod promise;
pub use promise::*;
pub mod commitment;
pub use commitment::*;
pub mod offer;
pub use offer::*;
use hdi::prelude::*;
#[hdk_extern]
pub fn validate(_op: Op) -> ExternResult<ValidateCallbackResult> {
    Ok(ValidateCallbackResult::Valid)
}
#[hdk_entry_defs]
#[unit_enum(UnitEntryTypes)]
pub enum EntryTypes {
    Offer(Offer),
    Commitment(Commitment),
    Promise(Promise),
    Fulfillment(Fulfillment),
}
#[hdk_link_types]
pub enum LinkTypes {
    OfferToCommitment,
    OfferToPromise,
    CommitmentToFulfillment,
    PromiseToFulfillment,
    AllOffers,
    AgentPubKeyToPromise,
}
