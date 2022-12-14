import { LitElement, html } from 'lit';
import { state, customElement, property } from 'lit/decorators.js';
import { InstalledCell, Record, AppWebsocket, ActionHash, InstalledAppInfo } from '@holochain/client';
import { contextProvided } from '@lit-labs/context';
import { appWebsocketContext, appInfoContext } from '../../contexts';
import './fulfillment-detail';

@customElement('fulfillment-for-commitment')
export class FulfillmentForCommitment extends LitElement {

  @property()
  actionHash!: ActionHash;

  @state()
  _records: Array<Record> | undefined;

  @contextProvided({ context: appWebsocketContext })
  appWebsocket!: AppWebsocket;

  @contextProvided({ context: appInfoContext })
  appInfo!: InstalledAppInfo;

  async firstUpdated() {
    const cellData = this.appInfo.cell_data.find((c: InstalledCell) => c.role_id === 'assemble')!;

    const records: Array<Record> = await this.appWebsocket.callZome({
      cap_secret: null,
      cell_id: cellData.cell_id,
      zome_name: 'assemble',
      fn_name: 'get_fulfillment_for_commitment',
      payload: this.actionHash,
      provenance: cellData.cell_id[1]
    });
  }

  render() {
    if (!this._records) {
      return html`<div style="display: flex; flex: 1; align-items: center; justify-content: center">
        <mwc-circular-progress indeterminate></mwc-circular-progress>
      </div>`;
    }
    return html`
      <div style="display: flex; flex-direction: column">
        ${this._records.map(r => 
          html`<fulfillment-detail .actionHash=${r.signed_action.hashed.hash}></fulfillment-detail>`
        )}
      </div>
    `;
  }
}
