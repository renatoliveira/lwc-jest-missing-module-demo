import { createElement } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import { registerLdsTestWireAdapter } from '@salesforce/lwc-jest';
import myComponent from 'c/myComponent';

const mockGetRecord = require('./data/getRecord.json');

const getRecordAdapter = registerLdsTestWireAdapter(getRecord);

describe('My component should', () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  function mockFetch(data) {
    return jest.fn().mockImplementation(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve(data)
    }))
  }

  it('load stuff', () => {

    const comp = createElement('c-myComponent', {
      is: myComponent
    });
    comp.url = 'https://fakeApi.com';
    document.body.appendChild(comp);

    getRecordAdapter.emit(mockGetRecord);

    const fetch = (global.fetch = mockFetch({}));

    return Promise.resolve().then(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith('https://fakeApi.com/47514723000172', {
        method: 'GET',
        headers: {},
        mode: 'cors',
        cache: 'default'
      });
    });
  })
});
