import { __decorate } from "tslib";
import { LitElement, html } from 'lit';
import { state, customElement } from 'lit/decorators.js';
import { contextProvided } from '@lit-labs/context';
import { appWebsocketContext, appInfoContext } from '../../contexts';
import '@material/mwc-circular-progress';
import '@material/mwc-list';
import '@material/mwc-list/mwc-list-item';
import './offer-detail';
import { RecordBag } from '@holochain-open-dev/utils';
let AllOffers = class AllOffers extends LitElement {
    async firstUpdated() {
        const cellData = this.appInfo.cell_data.find((c) => c.role_id === 'assemble');
        const records = await this.appWebsocket.callZome({
            cap_secret: null,
            cell_id: cellData.cell_id,
            zome_name: 'assemble',
            fn_name: 'get_all_offers',
            payload: null,
            provenance: cellData.cell_id[1]
        });
        this._records = new RecordBag(records);
    }
    render() {
        if (!this._records) {
            return html `<div style="display: flex; flex: 1; align-items: center; justify-content: center">
        <mwc-circular-progress indeterminate></mwc-circular-progress>
      </div>`;
        }
        if (this._records.entryRecords.length === 0)
            return html `<span>There are no offers yet</span>`;
        return html `
      <div style="display: flex; flex-direction: column">
        <mwc-list>
        ${this._records.actionMap.entries().map(([actionHash, a]) => {
            var _a;
            return html `<mwc-list-item @click=${() => this.dispatchEvent(new CustomEvent('offer-selected', {
                bubbles: true,
                composed: true,
                detail: {
                    actionHash
                }
            }))}>${(_a = this._records) === null || _a === void 0 ? void 0 : _a.entryMap.get(a.entry_hash).title}</mwc-list-item>`;
        })}
      </mwc-list>
      </div>
    `;
    }
};
__decorate([
    state()
], AllOffers.prototype, "_records", void 0);
__decorate([
    contextProvided({ context: appWebsocketContext })
], AllOffers.prototype, "appWebsocket", void 0);
__decorate([
    contextProvided({ context: appInfoContext })
], AllOffers.prototype, "appInfo", void 0);
AllOffers = __decorate([
    customElement('all-offers')
], AllOffers);
export { AllOffers };
//# sourceMappingURL=all-offers.js.map