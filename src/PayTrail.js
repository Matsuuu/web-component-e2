const paymentUrl = 'https://payment.paytrail.com/e2';

const template = document.createElement('template');
template.innerHTML = `
<form action=${paymentUrl} method="POST">

</form>
`;

const requiredFields = [
    'merchant_id',
    'url_success',
    'url_cancel',
    'order_number',
    'amount',
    'params_in',
    'params_out',
    'authcode',
];

const requiredParamsOut = ['payment_id', 'timestamp', 'status'];

const requiredProductFields = ['item_title', 'item_unit_price', 'item_vat_percent'];

export class PayTrail extends HTMLElement {
    constructor() {
        super();

        this.initializeFields();
        const root = this.attachShadow({ mode: 'open' });
        root.appendChild(template.content.cloneNode(true));
        document.addEventListener('click', this.calculateAuthCode.bind(this));
    }

    initializeFields() {
        this.merchant_authentication_hash = '6pKF4jkv97zmqBJ3ZL8gUw5DfT2NMQ';
        this.submit_button_label = 'Pay here';
        this.merchant_id = '13466';
        this.currency = 'EUR';
        this.amount = 0.0;
        this.alg = 1;
        this.locale = 'fi_FI';
        this.vat_is_included = 1;
    }

    calculateAuthCode() {
        const authCodeString = Array.from(this.shadowRoot.querySelectorAll('input[type=hidden]'))
            .filter(f => f.name !== 'AUTHCODE')
            .reduce((a, b) => {
                return `${a}|${b.value}`;
            }, '');
        console.log(authCodeString);
        // TODO: Figure out how to hash it without deps. Might have to use deps tho.
    }

    calculatePaymentId() {}

    static get observedAttributes() {
        return [
            'submit_button_label',
            'merchant_authentication_hash',
            'merchant_id',
            'url_success',
            'url_cancel',
            'order_number',
            'amount',
            'params_in',
            'params_out',
            'alg',
            'authcode',
            'url_notify',
            'locale',
            'reference_number',
            'payment_methods',
            'vat_is_included',
            'msg_settlement_payer',
            'msg_ui_payment_method',
            'msg_ui_merchant_panel',
            'expiration_for_payment_creation',
            'payer_person_firstname',
            'payer_person_lastname',
            'payer_person_email',
            'payer_person_phone',
            'payer_person_addr_street',
            'payer_person_addr_postal_code',
            'payer_person_addr_town',
            'payer_person_addr_country',
            'payer_company_name',
        ];
    }

    attributeChangedCallback(attributeName, oldValue, newValue) {
        this._generateFields();
        this[attributeName] = newValue;
    }

    connectedCallback() {
        this._checkRequiredFields();
        this._generateFields();
    }

    _checkRequiredFields() {
        const splitParamsOut = this.params_out ? this.params_out.toLowerCase().split(',') : [];
        requiredParamsOut.forEach(paramOut => {
            if (!splitParamsOut.includes(paramOut.toLowerCase())) {
                throw Error(
                    `PARAMS_OUT doesn't include all of the required fields.\nRequired fields:\n\n${requiredParamsOut.map(
                        pout => `${pout.toUpperCase()}\n`
                    )}`
                );
            }
        });
    }

    _generateFields() {
        console.log({ ...this });

        const form = this.shadowRoot.querySelector('form');
        form.innerHTML = '';
        const fields = this.PARAMS_IN ? this.PARAMS_IN.split(',') : [];

        requiredFields.forEach(reqField => {
            if (!fields.includes(reqField)) {
                fields.push(reqField);
            }
        });
        const documentFragment = document.createDocumentFragment();

        fields.forEach(field => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = field.toUpperCase();
            input.value = this[field] || '';
            documentFragment.appendChild(input);
        });

        const submitButton = document.createElement('input');
        submitButton.type = 'submit';
        submitButton.value = this.submit_button_label;
        documentFragment.appendChild(submitButton);

        form.appendChild(documentFragment);
    }
}

if (!customElements.get('pay-trail')) {
    customElements.define('pay-trail', PayTrail);
}
