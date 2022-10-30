import { LitElement, html } from 'lit';
import { state, customElement, property } from 'lit/decorators.js';
import { InstalledCell, ActionHash, Record, AppWebsocket, InstalledAppInfo } from '@holochain/client';
import { contextProvided } from '@lit-labs/context';
import { appWebsocketContext, appInfoContext } from '../../contexts';
import { Commitment } from './commitment';
import '@material/mwc-button';

@customElement('create-commitment')
export class CreateCommitment extends LitElement {
  @property()
  offerHash!: ActionHash;

  isCommitmentValid() {
    return     	this.offerHash ;
  }

  @contextProvided({ context: appWebsocketContext })
  appWebsocket!: AppWebsocket;

  @contextProvided({ context: appInfoContext })
  appInfo!: InstalledAppInfo;

  async createCommitment() {
    const cellData = this.appInfo.cell_data.find((c: InstalledCell) => c.role_id === 'assemble')!;

    const commitment: Commitment = { 
        offer_hash: this.offerHash!,
      slots: []
    };

    const record: Record = await this.appWebsocket.callZome({
      cap_secret: null,
      cell_id: cellData.cell_id,
      zome_name: 'assemble',
      fn_name: 'create_commitment',
      payload: commitment,
      provenance: cellData.cell_id[1]
    });

    this.dispatchEvent(new CustomEvent('commitment-created', {
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
        <span style="font-size: 18px">Create Commitment</span>

          <!-- TODO: implement the creation of offer_hash -->

        <mwc-button 
          label="Create Commitment"
          .disabled=${!this.isCommitmentValid()}
          @click=${() => this.createCommitment()}
        ></mwc-button>
    </div>`;
  }
}
