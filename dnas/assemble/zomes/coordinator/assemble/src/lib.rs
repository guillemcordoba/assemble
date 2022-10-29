pub mod agent_pub_key_to_promise;
 pub mod all_offers;
pub mod fulfillment;
pub mod promise;
pub mod commitment;
pub mod offer;
use hdk::prelude::*;
#[hdk_extern]
pub fn init(_: ()) -> ExternResult<InitCallbackResult> {
    Ok(InitCallbackResult::Pass)
}
