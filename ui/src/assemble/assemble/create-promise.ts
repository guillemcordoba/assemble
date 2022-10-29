import { LitElement, html } from 'lit';
import { state, customElement, property } from 'lit/decorators.js';
import { InstalledCell, ActionHash, Record, AppWebsocket, InstalledAppInfo } from '@holochain/client';
import { contextProvided } from '@lit-labs/context';
import { appWebsocketContext, appInfoContext } from '../../contexts';
import { Promise } from './promise';
import '@material/mwc-button';

@customElement('create-promise')
export class CreatePromise extends LitElement {
  @property()
  offerHash!: ActionHash;

  @state()
  _offerHash: ActionHash
 | undefined;
  isPromiseValid() {
    return 
    	this._offerHash
    ;
  }

  @contextProvided({ context: appWebsocketContext })
  appWebsocket!: AppWebsocket;

  @contextProvided({ context: appInfoContext })
  appInfo!: InstalledAppInfo;

  async createPromise() {
    const cellData = this.appInfo.cell_data.find((c: InstalledCell) => c.role_id === 'assemble')!;

    const promise: Promise = { 
        offer_hash: this._offerHash!,
      offer: this.offer!,
    };

    const record: Record = await this.appWebsocket.callZome({
      cap_secret: null,
      cell_id: cellData.cell_id,
      zome_name: 'assemble',
      fn_name: 'create_promise',
      payload: promise,
      provenance: cellData.cell_id[1]
    });

    this.dispatchEvent(new CustomEvent('promise-created', {
      composed: true,
      bubbles: true,
      detail: {
        actionHash: record.signed_action.hashed.hash
      }
    }));
  }

  render() {
    return html`
      <div style="display: flex; flex-direction: column">
        <span style="font-size: 18px">Create Promise</span>

          <!-- TODO: implement the creation of offer_hash -->

        <mwc-button 
          label="Create Promise"
          .disabled=${!this.isPromiseValid()}
          @click=${() => this.createPromise()}
        ></mwc-button>
    </div>`;
  }
}
