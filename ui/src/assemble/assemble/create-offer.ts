import { LitElement, html } from 'lit';
import { state, customElement, property } from 'lit/decorators.js';
import { InstalledCell, ActionHash, Record, AppWebsocket, InstalledAppInfo } from '@holochain/client';
import { contextProvided } from '@lit-labs/context';
import { appWebsocketContext, appInfoContext } from '../../contexts';
import { Offer, Slot } from './offer';
import '@material/mwc-button';
import '@material/mwc-textarea';
import '@material/mwc-textfield';

@customElement('create-offer')
export class CreateOffer extends LitElement {

  @state()
  _description: string | undefined;
  
  @state()
  _title: string | undefined;
  
  @state()
  _slots: Slot[] = [{
    title: '',
    description: '',
    required: true
  }];
  
  isOfferValid() {
    return this._description && this._title;
  }

  @contextProvided({ context: appWebsocketContext })
  appWebsocket!: AppWebsocket;

  @contextProvided({ context: appInfoContext })
  appInfo!: InstalledAppInfo;

  async createOffer() {
    const cellData = this.appInfo.cell_data.find((c: InstalledCell) => c.role_id === 'assemble')!;

    const offer: Offer = { 
        description: this._description!,
        title: this._title!,
      slots: this._slots
    };

    const record: Record = await this.appWebsocket.callZome({
      cap_secret: null,
      cell_id: cellData.cell_id,
      zome_name: 'assemble',
      fn_name: 'create_offer',
      payload: offer,
      provenance: cellData.cell_id[1]
    });

    this.dispatchEvent(new CustomEvent('offer-created', {
      composed: true,
      bubbles: true,
      detail: {
        actionHash: record.signed_action.hashed.hash
      }
    }));
  }
  
  renderSlot(s: Slot) {
    return html`
        
          <mwc-textfield outlined label="Title" @input=${(e: CustomEvent) => { s.title = (e.target as any).value; } }></mwc-textfield>

          <mwc-textarea outlined label="Description" @input=${(e: CustomEvent) => { s.description = (e.target as any).value;} }></mwc-textarea>
      
      `;
  }

  render() {
    return html`
      <div style="display: flex; flex-direction: column">
        <span style="font-size: 18px">Create Offer</span>

          <mwc-textfield outlined label="Title" @input=${(e: CustomEvent) => { this._title = (e.target as any).value; } }></mwc-textfield>

          <mwc-textarea outlined label="Description" @input=${(e: CustomEvent) => { this._description = (e.target as any).value;} }></mwc-textarea>

      <span>Slots</span>
      
      ${this._slots.map(s => this.renderSlot(s))}
      <mwc-button icon="add" label="Add slot" @click=${()=> this._slots = [...this._slots, {title: '', description: '', required: true}]}></mwc-button>
      
      <mwc-button 
      raised
          label="Create Offer"
          .disabled=${!this.isOfferValid()}
          @click=${() => this.createOffer()}
        ></mwc-button>
    </div>`;
  }
}
