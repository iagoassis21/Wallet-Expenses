import '@testing-library/jest-dom/extend-expect';
import MutationObserver from '@sheerun/mutationobserver-shim';
import React from 'react';
import mockCreateStore from './mockRedux/createStore';

window.MutationObserver = MutationObserver;
require('jest-localstorage-mock');

const { default: MockedComponent } = require(`./mockComponents/${process.env.mockName}`);

const mockProps = JSON.parse(process.env.props);

jest.mock(`../../${process.env.componentPath}`,
  () => () => <MockedComponent { ...mockProps } />);

jest.mock('redux', () => {
  const originalModule = jest.requireActual('redux');

  return {
    __esModule: true,
    ...originalModule,
    createStore: mockCreateStore,
  };
});
