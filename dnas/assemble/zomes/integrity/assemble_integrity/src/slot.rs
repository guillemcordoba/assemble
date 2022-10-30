use hdi::prelude::*;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Slot {
    title: String,
    description: String,
    required: bool,
}
