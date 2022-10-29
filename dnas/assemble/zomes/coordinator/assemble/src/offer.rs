use hdk::prelude::*;
use assemble_integrity::*;
#[hdk_extern]
pub fn create_offer(offer: Offer) -> ExternResult<Record> {
    let offer_hash = create_entry(&EntryTypes::Offer(offer.clone()))?;
    let record = get(offer_hash.clone(), GetOptions::default())?
        .ok_or(
            wasm_error!(
                WasmErrorInner::Guest(String::from("Could not find the newly created Offer"))
            ),
        )?;
    let path = Path::from("all_offers");
    create_link(path.path_entry_hash()?, offer_hash.clone(), LinkTypes::AllOffers, ())?;
    Ok(record)
}
#[hdk_extern]
pub fn get_offer(action_hash: ActionHash) -> ExternResult<Option<Record>> {
    get(action_hash, GetOptions::default())
}
