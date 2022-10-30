use assemble_integrity::*;
use hdk::prelude::*;

use crate::promise::create_promise;

#[hdk_extern]
pub fn create_commitment(commitment: Commitment) -> ExternResult<Record> {
    let commitment_hash = create_entry(&EntryTypes::Commitment(commitment.clone()))?;
    create_link(
        commitment.offer_or_commitment_hash.clone(),
        commitment_hash.clone(),
        LinkTypes::OfferToCommitment,
        (),
    )?;
    let record = get(commitment_hash.clone(), GetOptions::default())?.ok_or(wasm_error!(
        WasmErrorInner::Guest(String::from("Could not find the newly created Commitment"))
    ))?;

    let _r = create_promise(commitment.offer_or_commitment_hash);

    Ok(record)
}

#[hdk_extern]
pub fn get_commitment(action_hash: ActionHash) -> ExternResult<Option<Record>> {
    get(action_hash, GetOptions::default())
}

#[hdk_extern]
pub fn get_commitments_for(offer_or_commitment_hash: ActionHash) -> ExternResult<Vec<Record>> {
    let links = get_links(offer_or_commitment_hash, LinkTypes::OfferToCommitment, None)?;
    let get_input: Vec<GetInput> = links
        .into_iter()
        .map(|link| GetInput::new(ActionHash::from(link.target).into(), GetOptions::default()))
        .collect();
    let maybe_records = HDK.with(|hdk| hdk.borrow().get(get_input))?;
    let record: Vec<Record> = maybe_records.into_iter().filter_map(|r| r).collect();
    Ok(record)
}
