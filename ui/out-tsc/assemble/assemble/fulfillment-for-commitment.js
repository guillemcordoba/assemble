import { __decorate } from "tslib";
import { LitElement, html } from 'lit';
import { state, customElement, property } from 'lit/decorators.js';
import { contextProvided } from '@lit-labs/context';
import { appWebsocketContext, appInfoContext } from '../../contexts';
import './fulfillment-detail';
let FulfillmentForCommitment = class FulfillmentForCommitment extends LitElement {
    async firstUpdated() {
        const cellData = this.appInfo.cell_data.find((c) => c.role_id === 'assemble');
        const records = await this.appWebsocket.callZome({
            cap_secret: null,
            cell_id: cellData.cell_id,
            zome_name: 'assemble',
            fn_name: 'get_fulfillment_for_commitment',
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
        ${this._records.map(r => html `<fulfillment-detail .actionHash=${r.signed_action.hashed.hash}></fulfillment-detail>`)}
      </div>
    `;
    }
};
__decorate([
    property()
], FulfillmentForCommitment.prototype, "actionHash", void 0);
__decorate([
    state()
], FulfillmentForCommitment.prototype, "_records", void 0);
__decorate([
    contextProvided({ context: appWebsocketContext })
], FulfillmentForCommitment.prototype, "appWebsocket", void 0);
__decorate([
    contextProvided({ context: appInfoContext })
], FulfillmentForCommitment.prototype, "appInfo", void 0);
FulfillmentForCommitment = __decorate([
    customElement('fulfillment-for-commitment')
], FulfillmentForCommitment);
export { FulfillmentForCommitment };
//# sourceMappingURL=fulfillment-for-commitment.js.map