/// <reference types="cypress" />

import mockFetch from '../mocks/fetch';
import {
  EMAIL_FIELD_TEST_ID,
  HEADER_CURRENCY_FIELD_TEST_ID,
  TOTAL_FIELD_TEST_ID,
  VALID_EMAIL,
} from '../utils/constants';
import { logInWithValidCredentials } from '../utils/helperFunctions';

describe('2 - Crie um header para a página de carteira contendo as seguintes características:', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000', {
      onBeforeLoad(win) {
        cy.stub(win, 'fetch').callsFake(mockFetch);
      },
    });

    logInWithValidCredentials();
  });

  it('Um elemento que exiba o email do usuário que fez login.', () => {
    cy.getByTestId(EMAIL_FIELD_TEST_ID).should('contain', VALID_EMAIL);
  });

  it('Crie um campo com a despesa total gerada pela lista de gastos.', () => {
    cy.getByTestId(TOTAL_FIELD_TEST_ID).should('contain', '0');
  });

  it('Crie um campo que mostre que qual câmbio está sendo utilizado, que será neste caso \'BRL\'', () => {
    cy.getByTestId(HEADER_CURRENCY_FIELD_TEST_ID).should('contain', 'BRL');
  });
});
