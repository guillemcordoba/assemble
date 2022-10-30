import { __decorate } from "tslib";
import { LitElement, html } from 'lit';
import { state, customElement, property } from 'lit/decorators.js';
import { contextProvided } from '@lit-labs/context';
import { appWebsocketContext, appInfoContext } from '../../contexts';
import '@material/mwc-button';
import '@material/mwc-checkbox';
import '@material/mwc-textarea';
let CreateFulfillment = class CreateFulfillment extends LitElement {
    isFulfillmentValid() {
        return this._commitmentHash &&
            this._fullfilled &&
            this._promiseHash &&
            this._reflection;
    }
    async createFulfillment() {
        const cellData = this.appInfo.cell_data.find((c) => c.role_id === 'assemble');
        const fulfillment = {
            commitment_hash: this.commitmentHash,
            fullfilled: this._fullfilled,
            promise_hash: this.promiseHash,
            reflection: this._reflection,
        };
        const record = await this.appWebsocket.callZome({
            cap_secret: null,
            cell_id: cellData.cell_id,
            zome_name: 'assemble',
            fn_name: 'create_fulfillment',
            payload: fulfillment,
            provenance: cellData.cell_id[1]
        });
        this.dispatchEvent(new CustomEvent('fulfillment-created', {
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
        <span style="font-size: 18px">Create Fulfillment</span>

          <!-- TODO: implement the creation of commitment_hash -->
          <mwc-formfield label="">
            <mwc-checkbox  @input=${(e) => { this._fullfilled = e.target.value; }}></mwc-checkbox>
          </mwc-formfield>
          <!-- TODO: implement the creation of promise_hash -->
          <mwc-textarea outlined label="" @input=${(e) => { this._reflection = e.target.value; }}></mwc-textarea>

        <mwc-button 
          label="Create Fulfillment"
          .disabled=${!this.isFulfillmentValid()}
          @click=${() => this.createFulfillment()}
        ></mwc-button>
    </div>`;
    }
};
__decorate([
    property()
], CreateFulfillment.prototype, "commitmentHash", void 0);
__decorate([
    property()
], CreateFulfillment.prototype, "promiseHash", void 0);
__decorate([
    state()
], CreateFulfillment.prototype, "_commitmentHash", void 0);
__decorate([
    state()
], CreateFulfillment.prototype, "_fullfilled", void 0);
__decorate([
    state()
], CreateFulfillment.prototype, "_promiseHash", void 0);
__decorate([
    state()
], CreateFulfillment.prototype, "_reflection", void 0);
__decorate([
    contextProvided({ context: appWebsocketContext })
], CreateFulfillment.prototype, "appWebsocket", void 0);
__decorate([
    contextProvided({ context: appInfoContext })
], CreateFulfillment.prototype, "appInfo", void 0);
CreateFulfillment = __decorate([
    customElement('create-fulfillment')
], CreateFulfillment);
export { CreateFulfillment };
//# sourceMappingURL=create-fulfillment.js.map