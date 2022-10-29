use hdk::prelude::*;
use assemble_integrity::*;

#[derive(Serialize, Deserialize, Debug)]
pub struct CreatePromiseForAgentPubKeyInput {
    agent_pub_key_hash: ActionHash,
    promise_hash: ActionHash,
}
#[hdk_extern]
pub fn add_promise_for_agent_pub_key(input: CreatePromiseForAgentPubKeyInput) -> ExternResult<()> {
    create_link(input.agent_pub_key_hash, input.promise_hash, LinkTypes::AgentPubKeyToPromise, ())?;

    Ok(())    
}

#[hdk_extern]
pub fn get_promise_for_agent_pub_key(agent_pub_key_hash: ActionHash) -> ExternResult<Vec<Record>> {
    let links = get_links(agent_pub_key_hash, LinkTypes::AgentPubKeyToPromise, None)?;
    
    let get_input: Vec<GetInput> = links
        .into_iter()
        .map(|link| GetInput::new(ActionHash::from(link.target).into(), GetOptions::default()))
        .collect();

    let maybe_records = HDK.with(|hdk| hdk.borrow().get(get_input))?;

    let record: Vec<Record> = maybe_records.into_iter().filter_map(|r| r).collect();

    Ok(record)
}
