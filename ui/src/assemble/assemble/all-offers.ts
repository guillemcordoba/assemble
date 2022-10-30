import { LitElement, html } from 'lit';
import { state, customElement, property } from 'lit/decorators.js';
import { InstalledCell, AgentPubKey, Record, AppWebsocket, InstalledAppInfo, Create } from '@holochain/client';
import { contextProvided } from '@lit-labs/context';
import { appWebsocketContext, appInfoContext } from '../../contexts';
import '@material/mwc-circular-progress';
import '@material/mwc-list';
import '@material/mwc-list/mwc-list-item';
import './offer-detail';
import {RecordBag} from '@holochain-open-dev/utils';
import { Offer } from './offer';

@customElement('all-offers')
export class AllOffers extends LitElement {

  @state()
  _records: RecordBag<Offer> | undefined;

  @contextProvided({ context: appWebsocketContext })
  appWebsocket!: AppWebsocket;

  @contextProvided({ context: appInfoContext })
  appInfo!: InstalledAppInfo;

  async firstUpdated() {
    const cellData = this.appInfo.cell_data.find((c: InstalledCell) => c.role_id === 'assemble')!;

    const records = await this.appWebsocket.callZome({
      cap_secret: null,
      cell_id: cellData.cell_id,
      zome_name: 'assemble',
      fn_name: 'get_all_offers',
      payload: null,
      provenance: cellData.cell_id[1]
    });
    
    this._records = new RecordBag(records);
  }

  render() {
    if (!this._records) {
      return html`<div style="display: flex; flex: 1; align-items: center; justify-content: center">
        <mwc-circular-progress indeterminate></mwc-circular-progress>
      </div>`;
    }
    return html`
      <div style="display: flex; flex-direction: column">
        <mwc-list>
        ${this._records.actionMap.entries().map(([actionHash, a]) => html`<mwc-list-item @click=${()=> this.dispatchEvent(new CustomEvent('offer-selected', {
        bubbles: true,
        composed: true,
        detail: {
          actionHash
        }
      }))}>${this._records?.entryMap.get((a as Create).entry_hash).title}</mwc-list-item>`)}
      </mwc-list>
      </div>
    `;
  }
}
