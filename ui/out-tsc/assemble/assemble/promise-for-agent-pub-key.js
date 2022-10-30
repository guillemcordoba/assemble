import { __decorate } from "tslib";
import { LitElement, html } from 'lit';
import { state, property, customElement } from 'lit/decorators.js';
import { contextProvided } from '@lit-labs/context';
import { appWebsocketContext, appInfoContext } from '../../contexts';
import '@material/mwc-circular-progress';
import './promise-detail';
let PromiseForAgentPubKey = class PromiseForAgentPubKey extends LitElement {
    async firstUpdated() {
        const cellData = this.appInfo.cell_data.find((c) => c.role_id === 'assemble');
        this._records = await this.appWebsocket.callZome({
            cap_secret: null,
            cell_id: cellData.cell_id,
            zome_name: 'assemble',
            fn_name: 'get_promise_for_agent_pub_key',
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
        ${this._records.map(r => html `<promise-detail .actionHash=${r.signed_action.hashed.hash} style="margin-bottom: 16px;"></promise-detail>`)}
      </div>
    `;
    }
};
__decorate([
    property()
], PromiseForAgentPubKey.prototype, "actionHash", void 0);
__decorate([
    state()
], PromiseForAgentPubKey.prototype, "_records", void 0);
__decorate([
    contextProvided({ context: appWebsocketContext })
], PromiseForAgentPubKey.prototype, "appWebsocket", void 0);
__decorate([
    contextProvided({ context: appInfoContext })
], PromiseForAgentPubKey.prototype, "appInfo", void 0);
PromiseForAgentPubKey = __decorate([
    customElement('promise-for-agent-pub-key')
], PromiseForAgentPubKey);
export { PromiseForAgentPubKey };
//# sourceMappingURL=promise-for-agent-pub-key.js.map