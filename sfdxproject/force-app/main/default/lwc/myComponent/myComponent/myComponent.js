import { LightningElement, track, api, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getRecord } from 'lightning/uiRecordApi';
import DOCUMENT_FIELD from '@salesforce/schema/Account.Document__c';

export default class MyComponent extends LightningElement {
  @api recordId;
  @api url = '';
  @track products = [];

  @wire(getRecord, { recordId: '$recordId', fields: [DOCUMENT_FIELD] })
  wiredRecord({ error, data }) {
    if (error) {
      let message = 'Unknown error';
      if (Array.isArray(error.body)) {
        message = error.body.map(e => e.message).join(', ');
      } else if (typeof error.body.message === 'string') {
        message = error.body.message;
      }
      this.dispatchEvent(
        new ShowToastEvent({
          title: 'Could not load customer data.',
          message,
          variant: 'error',
        }),
      );
    } else if (data) {
      this.getCustomerData(data.fields.Document__c.value);
    }
  }

  getCustomerData(args) {
    if (!this.validate(args)) {
      return;
    }

    fetch(this.url + '/' + args, {
      method: 'GET',
      headers: {},
      mode: 'cors',
      cache: 'default'
    }).then(response => {
      return response.json();
    }).then(data => {
      this.products = this.transformValues(data);
    }).catch(error => {
      // eslint-disable-next-line no-console
      console.log(error);
      this.dispatchEvent(new ShowToastEvent({
        title: 'Erro',
        message: 'Error while fetching product data.',
        variant: 'error'
      }));
    });
  }

  transformValues(data) {
    let values = Object.keys(data).map(function (k) {
      return { label: k, value: data[k] };
    });
    return values.filter(val => {
      return val.value;
    })

  }

  validate(args) {
    let valid = true;
    if (this.url === '') {
      this.dispatchEvent(new ShowToastEvent({
        title: 'Erro',
        message: 'Web address not set',
        variant: 'error'
      }));
      valid = false;
    }

    if (args == null || args === '') {
      this.dispatchEvent(new ShowToastEvent({
        title: 'Erro',
        message: 'Customer without document. Can\'t retrieve data.',
        variant: 'error'
      }));
      valid = false;
    }

    return valid;
  }
}