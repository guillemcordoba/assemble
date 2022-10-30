import { __decorate } from "tslib";
import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { AppWebsocket, } from '@holochain/client';
import { contextProvider } from '@lit-labs/context';
import '@material/mwc-circular-progress';
import '@material/mwc-drawer';
import '@material/mwc-dialog';
import { appWebsocketContext, appInfoContext } from './contexts';
import './assemble/assemble/all-offers';
import './assemble/assemble/create-offer';
import './assemble/assemble/offer-detail';
let HolochainApp = class HolochainApp extends LitElement {
    constructor() {
        super(...arguments);
        this.loading = true;
    }
    async firstUpdated() {
        this.appWebsocket = await AppWebsocket.connect(`ws://localhost:${process.env.HC_PORT}`);
        this.appInfo = await this.appWebsocket.appInfo({
            installed_app_id: 'assemble',
        });
        this.loading = false;
    }
    render() {
        if (this.loading)
            return html `
        <mwc-circular-progress indeterminate></mwc-circular-progress>
      `;
        return html `
      <mwc-dialog id="create-offer-dialog">
      <create-offer @offer-created=${async (e) => {
            var _a;
            await ((_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.getElementById('all-offers')).firstUpdated();
            this._selectedOfferHash = e.detail.actionHash;
        }}></create-offer>
      </mwc-dialog>
      
      <main>
    <mwc-drawer>
    <div>
          <all-offers id="all-offers" style="flex: 1;" @offer-selected=${(e) => this._selectedOfferHash = e.detail.actionHash}></all-offers>
      <mwc-button label="Create offer" @click=${() => { var _a; return ((_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.getElementById('create-offer-dialog')).show(); }}></mwc-button>
    </div>
    <div slot="appContent">
      ${this._selectedOfferHash ?
            html `<offer-detail .actionHash=${this._selectedOfferHash}></offer-detail>` :
            html `<span>Select an offer to see its detail</span>`}
          </div>
</mwc-drawer>
  </main>`;
    }
};
HolochainApp.styles = css `
    :host {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      font-size: calc(10px + 2vmin);
      color: #1a2b42;
      max-width: 960px;
      margin: 0 auto;
      text-align: center;
      background-color: var(--lit-element-background-color);
    }

    main {
      flex-grow: 1;
    }

    .app-footer {
      font-size: calc(12px + 0.5vmin);
      align-items: center;
    }

    .app-footer a {
      margin-left: 5px;
    }
  `;
__decorate([
    state()
], HolochainApp.prototype, "loading", void 0);
__decorate([
    state()
], HolochainApp.prototype, "_selectedOfferHash", void 0);
__decorate([
    contextProvider({ context: appWebsocketContext }),
    property({ type: Object })
], HolochainApp.prototype, "appWebsocket", void 0);
__decorate([
    contextProvider({ context: appInfoContext }),
    property({ type: Object })
], HolochainApp.prototype, "appInfo", void 0);
HolochainApp = __decorate([
    customElement('holochain-app')
], HolochainApp);
export { HolochainApp };
//# sourceMappingURL=holochain-app.js.map