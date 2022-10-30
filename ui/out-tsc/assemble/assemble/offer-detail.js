import { __decorate } from "tslib";
import { LitElement, html } from 'lit';
import { state, customElement, property } from 'lit/decorators.js';
import { contextProvided } from '@lit-labs/context';
import { decode } from '@msgpack/msgpack';
import { appInfoContext, appWebsocketContext } from '../../contexts';
import '@material/mwc-circular-progress';
import { RecordBag } from '@holochain-open-dev/utils';
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
        const commitments = await this.appWebsocket.callZome({
            cap_secret: null,
            cell_id: cellData.cell_id,
            zome_name: 'assemble',
            fn_name: 'get_commitments_for',
            payload: this.actionHash,
            provenance: cellData.cell_id[1]
        });
        this._commitments = new RecordBag(commitments);
        if (record) {
            this._offer = decode(record.entry.Present.entry);
        }
    }
    async commitForSlot(index) {
        var _a;
        const cellData = this.appInfo.cell_data.find((c) => c.role_id === 'assemble');
        const record = await this.appWebsocket.callZome({
            cap_secret: null,
            cell_id: cellData.cell_id,
            zome_name: 'assemble',
            fn_name: 'create_commitment',
            payload: {
                offer_or_commitment_hash: this.actionHash,
                fulfilling_slot_index: index,
                slots: []
            },
            provenance: cellData.cell_id[1]
        });
        (_a = this._commitments) === null || _a === void 0 ? void 0 : _a.add([record]);
        this.requestUpdate();
    }
    renderSlot(s, index) {
        var _a;
        const isCompleted = !!((_a = this._commitments) === null || _a === void 0 ? void 0 : _a.entryMap.values().find(c => c.fulfilling_slot_index === index));
        return html `
      <div style="display: flex; flex-direction: row">
      <div style="display: flex; flex-direction:column">
        <span><strong>${s.title}</strong></span>
        <span>${s.description}</span>
      </div>
      ${isCompleted ? html `<mwc-icon>verified</mwc-icon>` :
            html `
      <mwc-button label="Commit" @click=${() => this.commitForSlot(index)}></mwc-button>
      `}
      </div>
      `;
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
		    <span><strong>Title</strong></span>
		    <span style="white-space: pre-line">${this._offer.title}</span>
		  </div>
		  <div style="display: flex; flex-direction: column">
		    <span><strong>Description</strong></span>
		    <span style="white-space: pre-line">${this._offer.description}</span>
		  </div>
      <span>Slots</span>
      
      ${this._offer.slots.map((r, i) => this.renderSlot(r, i))}
      
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
    state()
], OfferDetail.prototype, "_commitments", void 0);
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