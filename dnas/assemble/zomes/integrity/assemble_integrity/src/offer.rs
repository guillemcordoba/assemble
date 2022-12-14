use crate::Slot;
use hdi::prelude::*;

#[hdk_entry_helper]
#[derive(Clone)]
pub struct Offer {
    pub description: String,
    pub title: String,
    pub slots: Vec<Slot>,
}
