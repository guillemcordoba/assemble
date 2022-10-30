import { __decorate } from "tslib";
import { LitElement, html } from 'lit';
import { state, customElement, property } from 'lit/decorators.js';
import { contextProvided } from '@lit-labs/context';
import { decode } from '@msgpack/msgpack';
import { appInfoContext, appWebsocketContext } from '../../contexts';
import '@material/mwc-circular-progress';
let CommitmentDetail = class CommitmentDetail extends LitElement {
    async firstUpdated() {
        const cellData = this.appInfo.cell_data.find((c) => c.role_id === 'assemble');
        const record = await this.appWebsocket.callZome({
            cap_secret: null,
            cell_id: cellData.cell_id,
            zome_name: 'assemble',
            fn_name: 'get_commitment',
            payload: this.actionHash,
            provenance: cellData.cell_id[1]
        });
        if (record) {
            this._commitment = decode(record.entry.Present.entry);
        }
    }
    render() {
        if (!this._commitment) {
            return html `<div style="display: flex; flex: 1; align-items: center; justify-content: center">
        <mwc-circular-progress indeterminate></mwc-circular-progress>
      </div>`;
        }
        return html `
      <div style="display: flex; flex-direction: column">
        <span style="font-size: 18px">Commitment</span>
		  <!-- TODO: implement the rendering of offer_hash -->
      </div>
    `;
    }
};
__decorate([
    property()
], CommitmentDetail.prototype, "actionHash", void 0);
__decorate([
    state()
], CommitmentDetail.prototype, "_commitment", void 0);
__decorate([
    contextProvided({ context: appWebsocketContext })
], CommitmentDetail.prototype, "appWebsocket", void 0);
__decorate([
    contextProvided({ context: appInfoContext })
], CommitmentDetail.prototype, "appInfo", void 0);
CommitmentDetail = __decorate([
    customElement('commitment-detail')
], CommitmentDetail);
export { CommitmentDetail };
//# sourceMappingURL=commitment-detail.js.map