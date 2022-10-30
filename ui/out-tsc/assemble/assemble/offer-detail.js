import { __decorate } from "tslib";
import { LitElement, html } from 'lit';
import { state, customElement, property } from 'lit/decorators.js';
import { contextProvided } from '@lit-labs/context';
import { decode } from '@msgpack/msgpack';
import { appInfoContext, appWebsocketContext } from '../../contexts';
import '@material/mwc-circular-progress';
let OfferDetail = class OfferDetail extends LitElement {
    async firstUpdated() {
        const cellData = this.appInfo.cell_data.find((c) => c.role_id === 'assemble');
        const record = await this.appWebsocket.callZome({
            cap_secret: null,
            cell_id: cellData.cell_id,
            zome_name: 'assemble',
            fn_name: 'get_offer',
            payload: this.actionHash,
            provenance: cellData.cell_id[1]
        });
        if (record) {
            this._offer = decode(record.entry.Present.entry);
        }
    }
    render() {
        if (!this._offer) {
            return html `<div style="display: flex; flex: 1; align-items: center; justify-content: center">
        <mwc-circular-progress indeterminate></mwc-circular-progress>
      </div>`;
        }
        return html `
      <div style="display: flex; flex-direction: column">
        <span style="font-size: 18px">Offer</span>
		  <div style="display: flex; flex-direction: column">
		    <span><strong></strong></span>
		    <span style="white-space: pre-line">${this._offer.description}</span>
		  </div>
		  <div style="display: flex; flex-direction: column">
		    <span><strong></strong></span>
		    <span style="white-space: pre-line">${this._offer.title}</span>
		  </div>
      </div>
    `;
    }
};
__decorate([
    property()
], OfferDetail.prototype, "actionHash", void 0);
__decorate([
    state()
], OfferDetail.prototype, "_offer", void 0);
__decorate([
    contextProvided({ context: appWebsocketContext })
], OfferDetail.prototype, "appWebsocket", void 0);
__decorate([
    contextProvided({ context: appInfoContext })
], OfferDetail.prototype, "appInfo", void 0);
OfferDetail = __decorate([
    customElement('offer-detail')
], OfferDetail);
export { OfferDetail };
//# sourceMappingURL=offer-detail.js.map