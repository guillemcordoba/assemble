import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import {
  AppWebsocket,
  ActionHash,
  InstalledAppInfo,
} from '@holochain/client';
import { contextProvider } from '@lit-labs/context';
import '@material/mwc-circular-progress';
import '@material/mwc-drawer';
import '@material/mwc-dialog';

import { appWebsocketContext, appInfoContext } from './contexts';

import './assemble/assemble/all-offers';
import './assemble/assemble/create-offer';
import './assemble/assemble/offer-detail';
import './assemble/assemble/my-promises';

@customElement('holochain-app')
export class HolochainApp extends LitElement {

  @state() loading = true;
  @state() _selectedOfferHash: ActionHash | undefined;
  @state() _selectedPromiseHash: ActionHash | undefined;

  @contextProvider({ context: appWebsocketContext })
  @property({ type: Object })
  appWebsocket!: AppWebsocket;

  @contextProvider({ context: appInfoContext })
  @property({ type: Object })
  appInfo!: InstalledAppInfo;

  async firstUpdated() {
    this.appWebsocket = await AppWebsocket.connect(
      `ws://localhost:${process.env.HC_PORT}`
    );

    this.appInfo = await this.appWebsocket.appInfo({
      installed_app_id: 'assemble',
    });

    this.loading = false;
  }

  render() {
    if (this.loading)
      return html`
        <mwc-circular-progress indeterminate></mwc-circular-progress>
      `;

    return html`
      <mwc-dialog id="create-offer-dialog">
      <create-offer @offer-created=${async (e: CustomEvent) => {
        this._selectedOfferHash = e.detail.actionHash;

        setTimeout(async ()=> {
          
                await (this.shadowRoot?.getElementById('all-offers') as any).firstUpdated();
        (this.shadowRoot?.getElementById('create-offer-dialog') as any).close();
        await (this.shadowRoot?.getElementById('offer-detail') as any)?.firstUpdated();
        })
      }}></create-offer>
      </mwc-dialog>
      
      <main>
      <div style="flex: 1; display: flex; flex-direction: row">
    <mwc-drawer style="flex: 1">
    <div style="height: 100%; display: flex; flex-direction: column">
          <all-offers id="all-offers" style="flex: 1;" @offer-selected=${async (e: CustomEvent)=>{
        this._selectedOfferHash = e.detail.actionHash;
        
        setTimeout(async ()=> {
          
        
        await (this.shadowRoot?.getElementById('offer-detail') as any)?.firstUpdated();
     }) }}></all-offers>
      <mwc-button label="Create offer" @click=${() => (this.shadowRoot?.getElementById('create-offer-dialog') as any).show()}></mwc-button>
    </div>
    <div slot="appContent">
      ${this._selectedOfferHash ? 
        html`<offer-detail id="offer-detail" .actionHash=${this._selectedOfferHash} @offer-completed=${async ()=> {
          this._selectedOfferHash = undefined;
          
                    
          setTimeout(async () => {
          await (this.shadowRoot?.getElementById('all-offers') as any).firstUpdated();
          await (this.shadowRoot?.getElementById('my-promises') as any).firstUpdated();

          await (this.shadowRoot?.getElementById('offer-detail') as any)?.firstUpdated();
          })
        }}></offer-detail>` : 
        html`<span>Select an offer to see its detail</span>`}
          </div>
</mwc-drawer>

          <mwc-drawer style="flex: 1">
    <div style="height: 100%; display: flex; flex-direction: column">
          <my-promises id="my-promises" style="flex: 1;" @promise-selected=${async (e: CustomEvent)=>{
        this._selectedPromiseHash = e.detail.promiseActionHash;
          setTimeout(async () => {
           await (this.shadowRoot?.getElementById('promise-detail') as any)?.firstUpdated();
     }) }}></my-promises>
    </div>
    <div slot="appContent">
      ${this._selectedPromiseHash ? 
        html`<promise-detail id="promise-detail" .actionHash=${this._selectedPromiseHash}></promise-detail>` : 
        html`<span>Select a promise to see its detail</span>`}
          </div>
</mwc-drawer>
      </div>
  </main>`;
  }

  static styles = css`
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
}
