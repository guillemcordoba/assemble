import { __decorate } from "tslib";
import { LitElement, html } from 'lit';
import { state, customElement, property } from 'lit/decorators.js';
import { contextProvided } from '@lit-labs/context';
import { appWebsocketContext, appInfoContext } from '../../contexts';
import './commitment-detail';
let CommitmentForOffer = class CommitmentForOffer extends LitElement {
    async firstUpdated() {
        const cellData = this.appInfo.cell_data.find((c) => c.role_id === 'assemble');
        const records = await this.appWebsocket.callZome({
            cap_secret: null,
            cell_id: cellData.cell_id,
            zome_name: 'assemble',
            fn_name: 'get_commitment_for_offer',
            payload: this.actionHash,
            provenance: cellData.cell_id[1]
        });
    }
    render() {
        if (!this._records) {
            return html `<div style="display: flex; flex: 1; align-items: center; justify-content: center">
        <mwc-circular-progress indeterminate></mwc-circular-progress>
      </div>`;
        }
        return html `
      <div style="display: flex; flex-direction: column">
        ${this._records.map(r => html `<commitment-detail .actionHash=${r.signed_action.hashed.hash}></commitment-detail>`)}
      </div>
    `;
    }
};
__decorate([
    property()
], CommitmentForOffer.prototype, "actionHash", void 0);
__decorate([
    state()
], CommitmentForOffer.prototype, "_records", void 0);
__decorate([
    contextProvided({ context: appWebsocketContext })
], CommitmentForOffer.prototype, "appWebsocket", void 0);
__decorate([
    contextProvided({ context: appInfoContext })
], CommitmentForOffer.prototype, "appInfo", void 0);
CommitmentForOffer = __decorate([
    customElement('commitment-for-offer')
], CommitmentForOffer);
export { CommitmentForOffer };
//# sourceMappingURL=commitment-for-offer.js.map