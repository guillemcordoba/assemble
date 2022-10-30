import { __decorate } from "tslib";
import { LitElement, html } from 'lit';
import { state, customElement, property } from 'lit/decorators.js';
import { contextProvided } from '@lit-labs/context';
import { decode } from '@msgpack/msgpack';
import { appInfoContext, appWebsocketContext } from '../../contexts';
import '@material/mwc-circular-progress';
let PromiseDetail = class PromiseDetail extends LitElement {
    async firstUpdated() {
        const cellData = this.appInfo.cell_data.find((c) => c.role_id === 'assemble');
        const record = await this.appWebsocket.callZome({
            cap_secret: null,
            cell_id: cellData.cell_id,
            zome_name: 'assemble',
            fn_name: 'get_promise',
            payload: this.actionHash,
            provenance: cellData.cell_id[1]
        });
        if (record) {
            this._promise = decode(record.entry.Present.entry);
        }
    }
    render() {
        if (!this._promise) {
            return html `<div style="display: flex; flex: 1; align-items: center; justify-content: center">
        <mwc-circular-progress indeterminate></mwc-circular-progress>
      </div>`;
        }
        return html `
      <div style="display: flex; flex-direction: column">
        <span style="font-size: 18px">Promise</span>
		  <!-- TODO: implement the rendering of offer_hash -->
      </div>
    `;
    }
};
__decorate([
    property()
], PromiseDetail.prototype, "actionHash", void 0);
__decorate([
    state()
], PromiseDetail.prototype, "_promise", void 0);
__decorate([
    contextProvided({ context: appWebsocketContext })
], PromiseDetail.prototype, "appWebsocket", void 0);
__decorate([
    contextProvided({ context: appInfoContext })
], PromiseDetail.prototype, "appInfo", void 0);
PromiseDetail = __decorate([
    customElement('promise-detail')
], PromiseDetail);
export { PromiseDetail };
//# sourceMappingURL=promise-detail.js.map