import React, { useState } from 'react';
import '@paytrail/web-component-e2';

export default function PaytrailExample() {
    const [products, setProducts] = useState([]);
    let paytrailComponent;

    const addProduct = e => {
        e.preventDefault();
        if (!paytrailComponent) {
            paytrailComponent = document.querySelector('paytrail-web-component-e2');
        }

        const formData = new FormData(e.target);
        const product = {
            item_title: formData.get('item_title'),
            item_unit_price: formData.get('item_price'),
            item_vat_percent: formData.get('item_vat'),
        };
        setProducts([...products, product]);
        paytrailComponent.addProducts(product);
        calculateAuthcode();
    };

    const removeProductAtIndex = index => {
        if (!paytrailComponent) {
            paytrailComponent = document.querySelector('paytrail-web-component-e2');
        }
        paytrailComponent.removeProductAtIndex(index);
        products.splice(index, 1);
        setProducts([...products]);
        calculateAuthcode();
    };

    const calculateAuthcode = () => {
        paytrailComponent.calculateAuthCodeString();
    };

    const createProduct = (prod, i) => {
        return (
            <p onClick={() => removeProductAtIndex(i)} key={i}>
                {prod.item_title}, {prod.item_unit_price}€
            </p>
        );
    };

    return (
        <div>
            <style></style>
            <h2>Welcome to the Paytrail HTML Example</h2>
            <form onSubmit={addProduct}>
                <input type="text" placeholder="Item Title" name="item_title" defaultValue="Chocolate bar" />
                <input type="text" placeholder="Item Unit Price" name="item_price" defaultValue="0.99" />
                <input type="text" placeholder="Item Vat Percent" name="item_vat" defaultValue="24" />
                <input type="submit" value="Add product" />
            </form>
            <div className="products">{products.map((prod, i) => createProduct(prod, i))}</div>
            <paytrail-web-component-e2
                MERCHANT_ID="13466"
                ORDER_NUMBER="222"
                URL_SUCCESS="http://www.example.com/success"
                URL_CANCEL="http://www.example.com/cancel"
                PARAMS_IN="MERCHANT_ID,URL_SUCCESS,URL_CANCEL,ORDER_NUMBER,PARAMS_IN,PARAMS_OUT,PAYER_PERSON_PHONE,PAYER_PERSON_EMAIL,PAYER_PERSON_FIRSTNAME,PAYER_PERSON_LASTNAME,PAYER_COMPANY_NAME,PAYER_PERSON_ADDR_STREET,PAYER_PERSON_ADDR_POSTAL_CODE,PAYER_PERSON_ADDR_TOWN,PAYER_PERSON_ADDR_COUNTRY,AMOUNT"
                PARAMS_OUT="ORDER_NUMBER,PAYMENT_ID,AMOUNT,CURRENCY,PAYMENT_METHOD,TIMESTAMP,STATUS"
            >
                <label>Pay here</label>
            </paytrail-web-component-e2>
        </div>
    );
}
