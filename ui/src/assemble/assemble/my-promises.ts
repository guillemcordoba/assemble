import { LitElement, html } from 'lit';
import { state, customElement, property } from 'lit/decorators.js';
import { InstalledCell, Record, AppWebsocket, ActionHash, InstalledAppInfo, Create, CreateCloneCellRequest } from '@holochain/client';
import { contextProvided } from '@lit-labs/context';
import { appWebsocketContext, appInfoContext } from '../../contexts';
import './promise-detail';
import { Promise } from './promise';
import { RecordBag } from '@holochain-open-dev/utils';
import { Offer } from './offer';

@customElement('my-promises')
export class MyPromises extends LitElement {

  @state()
  _promises: RecordBag<Promise> | undefined;

  @state()
  _offers: RecordBag<Offer> | undefined;

  @contextProvided({ context: appWebsocketContext })
  appWebsocket!: AppWebsocket;

  @contextProvided({ context: appInfoContext })
  appInfo!: InstalledAppInfo;

  async firstUpdated() {
    const cellData = this.appInfo.cell_data.find((c: InstalledCell) => c.role_id === 'assemble')!;

    const {promises, offers} = await this.appWebsocket.callZome({
      cap_secret: null,
      cell_id: cellData.cell_id,
      zome_name: 'assemble',
      fn_name: 'get_my_promises',
      payload: null,
      provenance: cellData.cell_id[1]
    });
    
    this._promises = new RecordBag(promises);
    this._offers = new RecordBag(offers);
  }
  
  entryForAction<T>(r: RecordBag<T>, actionHash: ActionHash): T {  
    return r.entryMap.get((r.actionMap.get(actionHash) as  Create).entry_hash);
  }

  render() {
    if (!this._offers) {
      return html`<div style="display: flex; flex: 1; align-items: center; justify-content: center">
        <mwc-circular-progress indeterminate></mwc-circular-progress>
      </div>`;
    }

    if (this._offers.entryRecords.length === 0) return html`<span>There are no promises yet</span>`;

    return html`
      <div style="display: flex; flex-direction: column">
        <mwc-list>
        ${this._promises?.actionMap.entries().map(([actionHash, a]) => html`<mwc-list-item @click=${()=> this.dispatchEvent(new CustomEvent('promise-selected', {
        bubbles: true,
        composed: true,
        detail: {
          offerActionHash:  this._promises?.entryMap.get((a as Create).entry_hash).offer_hash!,
          promiseActionHash: actionHash
          }
      }))}>${this.entryForAction(this._offers!, this.entryForAction(this._promises!, actionHash).offer_hash!).title}
        </mwc-list-item>
        `)}
      </mwc-list>
      </div>
    `;
  }
}
