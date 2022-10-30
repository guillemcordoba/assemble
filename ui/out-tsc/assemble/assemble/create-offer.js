import { __decorate } from "tslib";
import { LitElement, html } from 'lit';
import { state, customElement } from 'lit/decorators.js';
import { contextProvided } from '@lit-labs/context';
import { appWebsocketContext, appInfoContext } from '../../contexts';
import '@material/mwc-button';
import '@material/mwc-textarea';
import '@material/mwc-textfield';
let CreateOffer = class CreateOffer extends LitElement {
    isOfferValid() {
        return this._description &&
            this._title;
    }
    async createOffer() {
        const cellData = this.appInfo.cell_data.find((c) => c.role_id === 'assemble');
        const offer = {
            description: this._description,
            title: this._title,
            slots: []
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
    render() {
        return html `
      <div style="display: flex; flex-direction: column">
        <span style="font-size: 18px">Create Offer</span>

          <mwc-textarea outlined label="" @input=${(e) => { this._description = e.target.value; }}></mwc-textarea>
          <mwc-textfield outlined label="" @input=${(e) => { this._title = e.target.value; }}></mwc-textfield>

        <mwc-button 
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