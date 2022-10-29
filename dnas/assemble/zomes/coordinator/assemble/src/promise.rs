use hdk::prelude::*;
use assemble_integrity::*;
#[hdk_extern]
pub fn create_promise(promise: Promise) -> ExternResult<Record> {
    let promise_hash = create_entry(&EntryTypes::Promise(promise.clone()))?;
    create_link(
        promise.offer_hash.clone(),
        promise_hash.clone(),
        LinkTypes::OfferToPromise,
        (),
    )?;
    let record = get(promise_hash.clone(), GetOptions::default())?
        .ok_or(
            wasm_error!(
                WasmErrorInner::Guest(String::from("Could not find the newly created Promise"))
            ),
        )?;
    Ok(record)
}
#[hdk_extern]
pub fn get_promise(action_hash: ActionHash) -> ExternResult<Option<Record>> {
    get(action_hash, GetOptions::default())
}
#[hdk_extern]
pub fn get_promise_for_offer(offer_hash: ActionHash) -> ExternResult<Vec<Record>> {
    let links = get_links(offer_hash, LinkTypes::OfferToPromise, None)?;
    let get_input: Vec<GetInput> = links
        .into_iter()
        .map(|link| GetInput::new(
            ActionHash::from(link.target).into(),
            GetOptions::default(),
        ))
        .collect();
    let maybe_records = HDK.with(|hdk| hdk.borrow().get(get_input))?;
    let record: Vec<Record> = maybe_records.into_iter().filter_map(|r| r).collect();
    Ok(record)
}
