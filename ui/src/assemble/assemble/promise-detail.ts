import { LitElement, html } from 'lit';
import { state, customElement, property } from 'lit/decorators.js';
import { InstalledCell, AppWebsocket, Record, ActionHash, InstalledAppInfo } from '@holochain/client';
import { contextProvided } from '@lit-labs/context';
import { decode } from '@msgpack/msgpack';
import { appInfoContext, appWebsocketContext } from '../../contexts';
import { Promise } from './promise';
import '@material/mwc-circular-progress';
import { Offer } from './offer';
import { Slot } from './offer';

@customElement('promise-detail')
export class PromiseDetail extends LitElement {
  @property()
  actionHash!: ActionHash;

  @state()
  _promise: Promise | undefined;

  @state()
  _offer: Offer | undefined;

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
      fn_name: 'get_promise',
      payload: this.actionHash,
      provenance: cellData.cell_id[1]
    });
    if (!record) throw new Error("Couldn't get promise"); 

    this._promise = decode((record.entry as any).Present.entry) as Promise;

    const offer: Record | undefined = await this.appWebsocket.callZome({
      cap_secret: null,
      cell_id: cellData.cell_id,
      zome_name: 'assemble',
      fn_name: 'get_offer',
      payload: this._promise.offer_hash,
      provenance: cellData.cell_id[1]
    });
    if (offer) {
      this._offer = decode((offer.entry as any).Present.entry) as Offer;
    }
  }
  
  renderSlot(s: Slot) {    
    return html`
      <div style="display: flex; flex-direction: row">
      <div style="display: flex; flex-direction:column">
        <span><strong>${s.title}</strong></span>
        <span>${s.description}</span>
      </div>
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
      <div style="display: flex; flex-direction: column; text-align: left">
        <span style="font-size: 18px">Offer</span>
		  <div style="display: flex; flex-direction: column">
		    <span><strong>Title</strong></span>
		    <span style="white-space: pre-line">${ this._offer.title }</span>
		  </div>
		  <div style="display: flex; flex-direction: column">
		    <span><strong>Description</strong></span>
		    <span style="white-space: pre-line">${this._offer.description }</span>
		  </div>
      <span style="margin-top: 16px">Slots</span>
      
      ${this._offer.slots.map((r) => this.renderSlot(r))}
      
      </div>
    `;
  }
}
