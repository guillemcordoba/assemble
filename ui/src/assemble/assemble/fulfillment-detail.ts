import { LitElement, html } from 'lit';
import { state, customElement, property } from 'lit/decorators.js';
import { InstalledCell, AppWebsocket, Record, ActionHash, InstalledAppInfo } from '@holochain/client';
import { contextProvided } from '@lit-labs/context';
import { decode } from '@msgpack/msgpack';
import { appInfoContext, appWebsocketContext } from '../../contexts';
import { Fulfillment } from './fulfillment';
import '@material/mwc-circular-progress';

@customElement('fulfillment-detail')
export class FulfillmentDetail extends LitElement {
  @property()
  actionHash!: ActionHash;

  @state()
  _fulfillment: Fulfillment | undefined;

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
      fn_name: 'get_fulfillment',
      payload: this.actionHash,
      provenance: cellData.cell_id[1]
    });
    if (record) {
      this._fulfillment = decode((record.entry as any).Present.entry) as Fulfillment;
    }
  }

  render() {
    if (!this._fulfillment) {
      return html`<div style="display: flex; flex: 1; align-items: center; justify-content: center">
        <mwc-circular-progress indeterminate></mwc-circular-progress>
      </div>`;
    }
    return html`
      <div style="display: flex; flex-direction: column">
        <span style="font-size: 18px">Fulfillment</span>
		  <!-- TODO: implement the rendering of commitment_hash -->
		  <div style="display: flex; flex-direction: row">
		    <span><strong></strong></span>
		    <span style="white-space: pre-line">${this._fulfillment.fullfilled ? 'Yes' : 'No' }</span>
		  </div>
		  <!-- TODO: implement the rendering of promise_hash -->
		  <div style="display: flex; flex-direction: column">
		    <span><strong></strong></span>
		    <span style="white-space: pre-line">${ this._fulfillment.reflection }</span>
		  </div>
      </div>
    `;
  }
}
