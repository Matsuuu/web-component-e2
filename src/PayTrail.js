const template = document.createElement('template');
template.innerHTML = `

`;

const requiredFields = [
    'MERCHANT_ID',
    'URL_SUCCESS',
    'URL_CANCEL',
    'ORDER_NUMBER',
    'AMOUNT',
    'PARAMS_IN',
    'PARAMS_OUT',
    'AUTHCODE',
];

const requiredProductFields = [
    'ITEM_TITLE',
    'ITEM_UNIT_PRICE',
    'ITEM_VAT_PERCENT',
];

export class PayTrail extends HTMLElement {
    constructor() {
        super();

        this.initializeFields();
        const root = this.attachShadow({ mode: 'open' });
        root.appendChild(template.content.cloneNode(true));
    }

    att(attributeName) {
        return this.hasAttribute(attributeName)
            ? this.getAttribute(attributeName)
            : '';
    }

    initializeFields() {
        this.MERCHANT_ID = '13466';
        this.CURRENCY = 'EUR';
        this.AMOUNT = 0.0;
        this.ALG = 1;
        this.LOCALE = 'fi_FI';
        this.VAT_IS_INCLUDED = 1;
    }

    static get observedAttributes() {
        return [
            'MERCHANT_ID',
            'URL_SUCCESS',
            'URL_CANCEL',
            'ORDER_NUMBER',
            'AMOUNT',
            'PARAMS_IN',
            'ALG',
            'AUTHCODE',
            'URL_NOTIFY',
            'LOCALE',
            'REFERENCE_NUMBER',
            'PAYMENT_METHODS',
            'VAT_IS_INCLUDED',
            'MSG_SETTLEMENT_PAYER',
            'MSG_UI_PAYMENT_METHOD',
            'MSG_UI_MERCHANT_PANEL',
            'EXPIRATION_FOR_PAYMENT_CREATION',
            'PAYER_PERSON_FIRSTNAME',
            'PAYER_PERSON_LASTNAME',
            'PAYER_PERSON_EMAIL',
            'PAYER_PERSON_PHONE',
            'PAYER_PERSON_ADDR_STREET',
            'PAYER_PERSON_ADDR_POSTAL_CODE',
            'PAYER_PERSON_ADDR_TOWN',
            'PAYER_PERSON_ADDR_COUNTRY',
            'PAYER_COMPANY_NAME',
        ];
    }

    attributeChangedCallback(attributeName, oldValue, newValue) {
        this._generateFields();
    }

    connectedCallback() {
        this._generateFields();
    }

    _generateFields() {
        this.shadowRoot.innerHTML = '';
        const fields = this.att('PARAMS_IN').split(',');
        const documentFragment = document.createDocumentFragment();
        fields.forEach(field => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = field;
            input.value = this.att(field);
            documentFragment.appendChild(input);
        });
        this.shadowRoot.appendChild(documentFragment);
    }
}

if (!customElements.get('pay-trail')) {
    customElements.define('pay-trail', PayTrail);
}
