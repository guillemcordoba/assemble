import { LitElement, html } from 'lit';
import { state, customElement, property } from 'lit/decorators.js';
import { InstalledCell, AppWebsocket, Record, ActionHash, InstalledAppInfo } from '@holochain/client';
import { contextProvided } from '@lit-labs/context';
import { decode } from '@msgpack/msgpack';
import { appInfoContext, appWebsocketContext } from '../../contexts';
import { Commitment } from './commitment';
import '@material/mwc-circular-progress';

@customElement('commitment-detail')
export class CommitmentDetail extends LitElement {
  @property()
  actionHash!: ActionHash;

  @state()
  _commitment: Commitment | undefined;

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
      fn_name: 'get_commitment',
      payload: this.actionHash,
      provenance: cellData.cell_id[1]
    });
    if (record) {
      this._commitment = decode((record.entry as any).Present.entry) as Commitment;
    }
  }

  render() {
    if (!this._commitment) {
      return html`<div style="display: flex; flex: 1; align-items: center; justify-content: center">
        <mwc-circular-progress indeterminate></mwc-circular-progress>
      </div>`;
    }
    return html`
      <div style="display: flex; flex-direction: column">
        <span style="font-size: 18px">Commitment</span>
		  <!-- TODO: implement the rendering of offer_hash -->
      </div>
    `;
  }
}
