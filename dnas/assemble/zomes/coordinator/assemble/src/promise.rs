use assemble_integrity::*;
use hdk::prelude::*;

use crate::commitment::get_commitments_for;

pub enum SlotsStatus {
    Pending,
    Completed { commitments: Vec<Record> },
}

fn are_all_slots_completed(
    slots: Vec<Slot>,
    offer_or_commitment_hash: ActionHash,
) -> ExternResult<SlotsStatus> {
    let mut records = get_commitments_for(offer_or_commitment_hash)?;

    if slots.len() != records.len() {
        return Ok(SlotsStatus::Pending);
    } else {
        for r in records.clone() {
            match get_offer_or_commitment_status(r.action_address().clone())? {
                SlotsStatus::Pending => {
                    return Ok(SlotsStatus::Pending);
                }
                SlotsStatus::Completed { commitments } => {
                    for c in commitments {
                        records.push(c);
                    }
                }
            }
        }
    }

    Ok(SlotsStatus::Completed {
        commitments: records,
    })
}

pub fn get_offer_or_commitment_status(
    offer_or_commitment_hash: ActionHash,
) -> ExternResult<SlotsStatus> {
    let r = get(offer_or_commitment_hash.clone(), GetOptions::default())?.ok_or(wasm_error!(
        WasmErrorInner::Guest("Could not get offer or commitment".into())
    ))?;

    if let Ok(Some(commitment)) = r.entry().to_app_option::<Commitment>() {
        return are_all_slots_completed(commitment.slots, offer_or_commitment_hash);
    } else if let Ok(Some(offer)) = r.entry().to_app_option::<Offer>() {
        return are_all_slots_completed(offer.slots, offer_or_commitment_hash);
    }
    Err(wasm_error!(WasmErrorInner::Guest(
        "Not an offer nor a commitment".into()
    )))
}

#[hdk_extern]
pub fn create_promise(offer_hash: ActionHash) -> ExternResult<Record> {
    let offer = get(offer_hash.clone(), GetOptions::default())?.ok_or(wasm_error!(
        WasmErrorInner::Guest("Could not get offer".into())
    ))?;
    let status = get_offer_or_commitment_status(offer_hash.clone())?;

    let records = match status {
        SlotsStatus::Pending => Err(wasm_error!(WasmErrorInner::Guest(
            "Promise is not completed yet".into()
        ))),
        SlotsStatus::Completed { commitments } => Ok(commitments),
    }?;

    let commitment_hashes = records.iter().map(|r| r.action_address().clone()).collect();
    let mut all_participants: Vec<AgentPubKey> = records
        .into_iter()
        .map(|r| r.action().author().clone())
        .collect();
    all_participants.push(offer.action().author().clone());

    let promise = Promise {
        offer_hash,
        commitment_hashes,
    };

    let promise_hash = create_entry(&EntryTypes::Promise(promise.clone()))?;

    create_link(
        promise.offer_hash.clone(),
        promise_hash.clone(),
        LinkTypes::OfferToPromise,
        (),
    )?;

    for p in all_participants {
        create_link(p, promise_hash.clone(), LinkTypes::AgentPubKeyToPromise, ())?;
    }

    let path = Path::from("all_offers");
    let links = get_links(path.path_entry_hash()?, LinkTypes::AllOffers, None)?;

    for l in links {
        if ActionHash::from(l.target).eq(&promise.offer_hash) {
            delete_link(l.create_link_hash)?;
        }
    }

    let record = get(promise_hash.clone(), GetOptions::default())?.ok_or(wasm_error!(
        WasmErrorInner::Guest(String::from("Could not find the newly created Promise"))
    ))?;
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
        .map(|link| GetInput::new(ActionHash::from(link.target).into(), GetOptions::default()))
        .collect();
    let maybe_records = HDK.with(|hdk| hdk.borrow().get(get_input))?;
    let record: Vec<Record> = maybe_records.into_iter().filter_map(|r| r).collect();
    Ok(record)
}

#[derive(Serialize, Deserialize, Debug)]
pub struct GetMyPromisesOutput {
    promises: Vec<Record>,
    offers: Vec<Record>,
}
#[hdk_extern]
pub fn get_my_promises(_: ()) -> ExternResult<GetMyPromisesOutput> {
    let agent_pub_key = agent_info()?.agent_latest_pubkey;

    let links = get_links(agent_pub_key, LinkTypes::AgentPubKeyToPromise, None)?;
    let get_input: Vec<GetInput> = links
        .into_iter()
        .map(|link| GetInput::new(ActionHash::from(link.target).into(), GetOptions::default()))
        .collect();
    let maybe_records = HDK.with(|hdk| hdk.borrow().get(get_input))?;
    let promises_records: Vec<Record> = maybe_records.into_iter().filter_map(|r| r).collect();
    let promises: Vec<Promise> = promises_records
        .clone()
        .into_iter()
        .map(|r| r.entry().to_app_option::<Promise>())
        .collect::<Result<Vec<Option<Promise>>, SerializedBytesError>>()
        .map_err(|e| wasm_error!(e.into()))?
        .into_iter()
        .filter_map(|p| p)
        .collect();

    let get_input: Vec<GetInput> = promises
        .into_iter()
        .map(|p| GetInput::new(p.offer_hash.into(), GetOptions::default()))
        .collect();
    let maybe_records = HDK.with(|hdk| hdk.borrow().get(get_input))?;
    let records: Vec<Record> = maybe_records.into_iter().filter_map(|r| r).collect();

    Ok(GetMyPromisesOutput {
        promises: promises_records,
        offers: records,
    })
}
