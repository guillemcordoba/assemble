import { LitElement, html } from 'lit';
import { state, customElement, property } from 'lit/decorators.js';
import { InstalledCell, ActionHash, Record, AppWebsocket, InstalledAppInfo } from '@holochain/client';
import { contextProvided } from '@lit-labs/context';
import { appWebsocketContext, appInfoContext } from '../../contexts';
import { Fulfillment } from './fulfillment';
import '@material/mwc-button';
import '@material/mwc-checkbox';
import '@material/mwc-textarea';

@customElement('create-fulfillment')
export class CreateFulfillment extends LitElement {
  @property()
  commitmentHash!: ActionHash;
  @property()
  promiseHash!: ActionHash;

  @state()
  _commitmentHash: ActionHash | undefined;
  
  @state()
  _fullfilled: boolean | undefined;

    @state()
  _promiseHash: ActionHash  | undefined;
  
  @state()
  _reflection: string  | undefined;
  
  isFulfillmentValid() {
    return     	this._commitmentHash &&   
    	this._fullfilled &&   
    	this._promiseHash &&     
    	this._reflection;
  }

  @contextProvided({ context: appWebsocketContext })
  appWebsocket!: AppWebsocket;

  @contextProvided({ context: appInfoContext })
  appInfo!: InstalledAppInfo;

  async createFulfillment() {
    const cellData = this.appInfo.cell_data.find((c: InstalledCell) => c.role_id === 'assemble')!;

    const fulfillment: Fulfillment = { 
        commitment_hash: this.commitmentHash,
        fullfilled: this._fullfilled!,
        promise_hash: this.promiseHash,
        reflection: this._reflection!,
    };

    const record: Record = await this.appWebsocket.callZome({
      cap_secret: null,
      cell_id: cellData.cell_id,
      zome_name: 'assemble',
      fn_name: 'create_fulfillment',
      payload: fulfillment,
      provenance: cellData.cell_id[1]
    });

    this.dispatchEvent(new CustomEvent('fulfillment-created', {
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
        <span style="font-size: 18px">Create Fulfillment</span>

          <!-- TODO: implement the creation of commitment_hash -->
          <mwc-formfield label="">
            <mwc-checkbox  @input=${(e: CustomEvent) => { this._fullfilled = (e.target as any).value;} }></mwc-checkbox>
          </mwc-formfield>
          <!-- TODO: implement the creation of promise_hash -->
          <mwc-textarea outlined label="" @input=${(e: CustomEvent) => { this._reflection = (e.target as any).value;} }></mwc-textarea>

        <mwc-button 
          label="Create Fulfillment"
          .disabled=${!this.isFulfillmentValid()}
          @click=${() => this.createFulfillment()}
        ></mwc-button>
    </div>`;
  }
}
