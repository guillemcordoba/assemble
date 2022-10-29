import { LitElement, html } from 'lit';
import { state, customElement, property } from 'lit/decorators.js';
import { InstalledCell, AppWebsocket, Record, ActionHash, InstalledAppInfo } from '@holochain/client';
import { contextProvided } from '@lit-labs/context';
import { decode } from '@msgpack/msgpack';
import { appInfoContext, appWebsocketContext } from '../../contexts';
import { Promise } from './promise';
import '@material/mwc-circular-progress';

@customElement('promise-detail')
export class PromiseDetail extends LitElement {
  @property()
  actionHash!: ActionHash;

  @state()
  _promise: Promise | undefined;

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
    if (record) {
      this._promise = decode((record.entry as any).Present.entry) as Promise;
    }
  }

  render() {
    if (!this._promise) {
      return html`<div style="display: flex; flex: 1; align-items: center; justify-content: center">
        <mwc-circular-progress indeterminate></mwc-circular-progress>
      </div>`;
    }
    return html`
      <div style="display: flex; flex-direction: column">
        <span style="font-size: 18px">Promise</span>
		  <!-- TODO: implement the rendering of offer_hash -->
      </div>
    `;
  }
}
