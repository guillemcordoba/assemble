import { __decorate } from "tslib";
import { LitElement, html } from 'lit';
import { state, customElement } from 'lit/decorators.js';
import { contextProvided } from '@lit-labs/context';
import { appWebsocketContext, appInfoContext } from '../../contexts';
import '@material/mwc-button';
import '@material/mwc-textarea';
import '@material/mwc-textfield';
let CreateOffer = class CreateOffer extends LitElement {
    constructor() {
        super(...arguments);
        this._slots = [{
                title: '',
                description: '',
                required: true
            }];
    }
    isOfferValid() {
        return this._description && this._title;
    }
    async createOffer() {
        const cellData = this.appInfo.cell_data.find((c) => c.role_id === 'assemble');
        const offer = {
            description: this._description,
            title: this._title,
            slots: this._slots
        };
        const record = await this.appWebsocket.callZome({
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
    renderSlot(s) {
        return html `
        
          <mwc-textfield outlined label="Title" @input=${(e) => { s.title = e.target.value; }}></mwc-textfield>

          <mwc-textarea outlined label="Description" @input=${(e) => { s.description = e.target.value; }}></mwc-textarea>
      
      `;
    }
    render() {
        return html `
      <div style="display: flex; flex-direction: column">
        <span style="font-size: 18px">Create Offer</span>

          <mwc-textfield outlined label="Title" @input=${(e) => { this._title = e.target.value; }}></mwc-textfield>

          <mwc-textarea outlined label="Description" @input=${(e) => { this._description = e.target.value; }}></mwc-textarea>

      <span>Slots</span>
      
      ${this._slots.map(s => this.renderSlot(s))}
      <mwc-button icon="add" label="Add slot" @click=${() => this._slots = [...this._slots, { title: '', description: '', required: true }]}></mwc-button>
      
      <mwc-button 
      raised
          label="Create Offer"
          .disabled=${!this.isOfferValid()}
          @click=${() => this.createOffer()}
        ></mwc-button>
    </div>`;
    }
};
__decorate([
    state()
], CreateOffer.prototype, "_description", void 0);
__decorate([
    state()
], CreateOffer.prototype, "_title", void 0);
__decorate([
    state()
], CreateOffer.prototype, "_slots", void 0);
__decorate([
    contextProvided({ context: appWebsocketContext })
], CreateOffer.prototype, "appWebsocket", void 0);
__decorate([
    contextProvided({ context: appInfoContext })
], CreateOffer.prototype, "appInfo", void 0);
CreateOffer = __decorate([
    customElement('create-offer')
], CreateOffer);
export { CreateOffer };
//# sourceMappingURL=create-offer.js.map