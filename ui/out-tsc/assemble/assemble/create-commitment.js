import { __decorate } from "tslib";
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { contextProvided } from '@lit-labs/context';
import { appWebsocketContext, appInfoContext } from '../../contexts';
import '@material/mwc-button';
let CreateCommitment = class CreateCommitment extends LitElement {
    isCommitmentValid() {
        return this.offerHash;
    }
    async createCommitment() {
        const cellData = this.appInfo.cell_data.find((c) => c.role_id === 'assemble');
        const commitment = {
            offer_hash: this.offerHash,
            slots: []
        };
        const record = await this.appWebsocket.callZome({
            cap_secret: null,
            cell_id: cellData.cell_id,
            zome_name: 'assemble',
            fn_name: 'create_commitment',
            payload: commitment,
            provenance: cellData.cell_id[1]
        });
        this.dispatchEvent(new CustomEvent('commitment-created', {
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
        <span style="font-size: 18px">Create Commitment</span>

          <!-- TODO: implement the creation of offer_hash -->

        <mwc-button 
          label="Create Commitment"
          .disabled=${!this.isCommitmentValid()}
          @click=${() => this.createCommitment()}
        ></mwc-button>
    </div>`;
    }
};
__decorate([
    property()
], CreateCommitment.prototype, "offerHash", void 0);
__decorate([
    contextProvided({ context: appWebsocketContext })
], CreateCommitment.prototype, "appWebsocket", void 0);
__decorate([
    contextProvided({ context: appInfoContext })
], CreateCommitment.prototype, "appInfo", void 0);
CreateCommitment = __decorate([
    customElement('create-commitment')
], CreateCommitment);
export { CreateCommitment };
//# sourceMappingURL=create-commitment.js.map