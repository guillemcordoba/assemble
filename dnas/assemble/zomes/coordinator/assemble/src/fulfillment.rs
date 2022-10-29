use hdk::prelude::*;
use assemble_integrity::*;
#[hdk_extern]
pub fn create_fulfillment(fulfillment: Fulfillment) -> ExternResult<Record> {
    let fulfillment_hash = create_entry(&EntryTypes::Fulfillment(fulfillment.clone()))?;
    create_link(
        fulfillment.commitment_hash.clone(),
        fulfillment_hash.clone(),
        LinkTypes::CommitmentToFulfillment,
        (),
    )?;
    create_link(
        fulfillment.promise_hash.clone(),
        fulfillment_hash.clone(),
        LinkTypes::PromiseToFulfillment,
        (),
    )?;
    let record = get(fulfillment_hash.clone(), GetOptions::default())?
        .ok_or(
            wasm_error!(
                WasmErrorInner::Guest(String::from("Could not find the newly created Fulfillment"))
            ),
        )?;
    Ok(record)
}
#[hdk_extern]
pub fn get_fulfillment(action_hash: ActionHash) -> ExternResult<Option<Record>> {
    get(action_hash, GetOptions::default())
}
#[hdk_extern]
pub fn get_fulfillment_for_commitment(
    commitment_hash: ActionHash,
) -> ExternResult<Vec<Record>> {
    let links = get_links(commitment_hash, LinkTypes::CommitmentToFulfillment, None)?;
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
#[hdk_extern]
pub fn get_fulfillment_for_promise(
    promise_hash: ActionHash,
) -> ExternResult<Vec<Record>> {
    let links = get_links(promise_hash, LinkTypes::PromiseToFulfillment, None)?;
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
