import { LitElement, html } from 'lit';
import { state, customElement, property } from 'lit/decorators.js';
import { InstalledCell, AppWebsocket, Record, ActionHash, InstalledAppInfo } from '@holochain/client';
import { contextProvided } from '@lit-labs/context';
import { decode } from '@msgpack/msgpack';
import { appInfoContext, appWebsocketContext } from '../../contexts';
import { Offer, Slot } from './offer';
import '@material/mwc-circular-progress';
import { RecordBag } from '@holochain-open-dev/utils';
import { Commitment } from './commitment';

@customElement('offer-detail')
export class OfferDetail extends LitElement {
  @property()
  actionHash!: ActionHash;

  @state()
  _offer: Offer | undefined;

  @state()
  _commitments: RecordBag<Commitment> | undefined;

  @contextProvided({ context: appWebsocketContext })
  appWebsocket!: AppWebsocket;

  @contextProvided({ context: appInfoContext })
  appInfo!: InstalledAppInfo;

  async firstUpdated() {
    const cellData = this.appInfo.cell_data.find((c: InstalledCell) => c.role_id === 'assemble')!;
    const record: Record | undefined = await this.appWebsocket.callZome({
      cap_secret: null,
      cell_id: cellData.cell_id,
      zome_name: 'assemble',
      fn_name: 'get_offer',
      payload: this.actionHash,
      provenance: cellData.cell_id[1]
    });

   const commitments: Record[] = await this.appWebsocket.callZome({
      cap_secret: null,
      cell_id: cellData.cell_id,
      zome_name: 'assemble',
      fn_name: 'get_commitments_for',
      payload: this.actionHash,
      provenance: cellData.cell_id[1]
    });
    
    this._commitments = new RecordBag(commitments);
  
      if (record) {
      this._offer = decode((record.entry as any).Present.entry) as Offer;
    }
  }

  async commitForSlot(index: number) {
    const cellData = this.appInfo.cell_data.find((c: InstalledCell) => c.role_id === 'assemble')!;
    const record: Record = await this.appWebsocket.callZome({
      cap_secret: null,
      cell_id: cellData.cell_id,
      zome_name: 'assemble',
      fn_name: 'create_commitment',
      payload: {
        offer_or_commitment_hash: this.actionHash,
        fulfilling_slot_index: index,
        slots: []
      },
      provenance: cellData.cell_id[1]
    });
    
    this._commitments?.add([record]);
    this.requestUpdate();  
  }
  
  renderSlot(s: Slot, index: number) {
    const isCompleted = !!this._commitments?.entryMap.values().find(c => c.fulfilling_slot_index === index);
    
    return html`
      <div style="display: flex; flex-direction: row">
      <div style="display: flex; flex-direction:column">
        <span><strong>${s.title}</strong></span>
        <span>${s.description}</span>
      </div>
      ${isCompleted ? html`<mwc-icon>verified</mwc-icon>` :
        html`
      <mwc-button label="Commit" @click=${()=> this.commitForSlot(index)}></mwc-button>
      `}
      </div>
      `;
  }

  render() {
    if (!this._offer) {
      return html`<div style="display: flex; flex: 1; align-items: center; justify-content: center">
        <mwc-circular-progress indeterminate></mwc-circular-progress>
      </div>`;
    }
    return html`
      <div style="display: flex; flex-direction: column">
        <span style="font-size: 18px">Offer</span>
		  <div style="display: flex; flex-direction: column">
		    <span><strong>Title</strong></span>
		    <span style="white-space: pre-line">${ this._offer.title }</span>
		  </div>
		  <div style="display: flex; flex-direction: column">
		    <span><strong>Description</strong></span>
		    <span style="white-space: pre-line">${this._offer.description }</span>
		  </div>
      <span>Slots</span>
      
      ${this._offer.slots.map((r, i) => this.renderSlot(r, i))}
      
      </div>
    `;
  }
}
