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
import './assemble/assemble/my-promises';
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
            this._selectedOfferHash = e.detail.actionHash;
            setTimeout(async () => {
                var _a, _b, _c, _d;
                await ((_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.getElementById('all-offers')).firstUpdated();
                ((_b = this.shadowRoot) === null || _b === void 0 ? void 0 : _b.getElementById('create-offer-dialog')).close();
                await ((_d = (_c = this.shadowRoot) === null || _c === void 0 ? void 0 : _c.getElementById('offer-detail')) === null || _d === void 0 ? void 0 : _d.firstUpdated());
            });
        }}></create-offer>
      </mwc-dialog>
      
      <main>
      <div style="flex: 1; display: flex; flex-direction: row">
    <mwc-drawer style="flex: 1">
    <div style="height: 100%; display: flex; flex-direction: column">
          <all-offers id="all-offers" style="flex: 1;" @offer-selected=${async (e) => {
            this._selectedOfferHash = e.detail.actionHash;
            setTimeout(async () => {
                var _a, _b;
                await ((_b = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.getElementById('offer-detail')) === null || _b === void 0 ? void 0 : _b.firstUpdated());
            });
        }}></all-offers>
      <mwc-button label="Create offer" @click=${() => { var _a; return ((_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.getElementById('create-offer-dialog')).show(); }}></mwc-button>
    </div>
    <div slot="appContent">
      ${this._selectedOfferHash ?
            html `<offer-detail id="offer-detail" .actionHash=${this._selectedOfferHash} @offer-completed=${async () => {
                this._selectedOfferHash = undefined;
                setTimeout(async () => {
                    var _a, _b, _c, _d;
                    await ((_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.getElementById('all-offers')).firstUpdated();
                    await ((_b = this.shadowRoot) === null || _b === void 0 ? void 0 : _b.getElementById('my-promises')).firstUpdated();
                    await ((_d = (_c = this.shadowRoot) === null || _c === void 0 ? void 0 : _c.getElementById('offer-detail')) === null || _d === void 0 ? void 0 : _d.firstUpdated());
                });
            }}></offer-detail>` :
            html `<span>Select an offer to see its detail</span>`}
          </div>
</mwc-drawer>

          <mwc-drawer style="flex: 1">
    <div style="height: 100%; display: flex; flex-direction: column">
          <my-promises id="my-promises" style="flex: 1;" @promise-selected=${async (e) => {
            this._selectedPromiseHash = e.detail.promiseActionHash;
            setTimeout(async () => {
                var _a, _b;
                await ((_b = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.getElementById('promise-detail')) === null || _b === void 0 ? void 0 : _b.firstUpdated());
            });
        }}></my-promises>
    </div>
    <div slot="appContent">
      ${this._selectedPromiseHash ?
            html `<promise-detail id="promise-detail" .actionHash=${this._selectedPromiseHash}></promise-detail>` :
            html `<span>Select a promise to see its detail</span>`}
          </div>
</mwc-drawer>
      </div>
  </main>`;
    }
};
HolochainApp.styles = css `
    :host {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      font-size: calc(10px + 2vmin);
      color: #1a2b42;
      width: 100%;
      margin: 0;
      text-align: center;
      background-color: var(--lit-element-background-color);
    }

    main {
      display: flex;
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
    state()
], HolochainApp.prototype, "_selectedPromiseHash", void 0);
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