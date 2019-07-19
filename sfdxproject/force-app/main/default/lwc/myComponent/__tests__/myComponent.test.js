import { createElement } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import { registerLdsTestWireAdapter } from '@salesforce/lwc-jest';
import myComponent from 'c/myComponent';

const getRecordAdapter = registerLdsTestWireAdapter(getRecord);

const serviceResponse = {
  savings: true,
  digitalaccount: true,
  professionalaccount: true,
  insurance: true,
  forex: false
}

window.fetch = jest.fn().mockImplementation(() => Promise.resolve({
  json: () => Promise.resolve(serviceResponse)
}))

describe('My component should', () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it('load stuff', () => {

    const comp = createElement('c-myComponent', {
      is: myComponent
    });
    comp.url = 'https://fakeApi.com';
    document.body.appendChild(comp);

    getRecordAdapter.emit({
      "Id": "001000000000000AAA",
      "Name": "Maria",
      "fields": {
        "Document__c": {
          "value": "47514723000172"
        }
      }
    });

    return Promise.resolve().then(() => {
      expect(window.fetch).toHaveBeenCalledTimes(1);
      expect(window.fetch).toHaveBeenCalledWith('https://fakeApi.com/47514723000172', {
        method: 'GET',
        headers: {},
        mode: 'cors',
        cache: 'default'
      });
    });
  })
});
