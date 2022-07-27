/// <reference types="cypress" />

import mockFetch from '../mocks/fetch';
import {
  EMAIL_INPUT_TEST_ID,
  PASSWORD_INPUT_TEST_ID,
  VALID_EMAIL,
  VALID_PASSWORD,
  INVALID_EMAIL_0,
  INVALID_EMAIL_1,
  INVALID_EMAIL_2,
  INVALID_EMAIL_3,
  INVALID_PASSWORD,
} from '../utils/constants';
import { logInWithValidCredentials } from '../utils/helperFunctions';

describe('1 - Crie uma página inicial de login com os seguintes campos e características:', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/', {
      onBeforeLoad(win) {
        cy.stub(win, 'fetch').callsFake(mockFetch);
      },
    });
  });

  it('A rota para esta página deve ser \'/\'', () => {
    cy.location('pathname').should('eq', '/');
  });

  it('Crie um local para que o usuário insira seu email e senha', () => {
    cy.getByTestId(EMAIL_INPUT_TEST_ID).should('exist');
    cy.getByTestId(PASSWORD_INPUT_TEST_ID).should('exist');
  });

  it('Crie um botão com o texto \'Entrar\'', () => {
    cy.contains(/Entrar/i).should('exist');
  });

  it('Realize as seguintes verificações nos campos de email, senha e botão:', () => {
    cy.contains(/Entrar/i).should('be.disabled');

    cy.getByTestId(EMAIL_INPUT_TEST_ID).type(INVALID_EMAIL_0);
    cy.getByTestId(PASSWORD_INPUT_TEST_ID).type(VALID_PASSWORD);
    cy.contains(/Entrar/i).should('be.disabled');

    cy.getByTestId(EMAIL_INPUT_TEST_ID).clear().type(INVALID_EMAIL_1);
    cy.getByTestId(PASSWORD_INPUT_TEST_ID).clear().type(VALID_PASSWORD);
    cy.contains(/Entrar/i).should('be.disabled');

    cy.getByTestId(EMAIL_INPUT_TEST_ID).clear().type(INVALID_EMAIL_2);
    cy.getByTestId(PASSWORD_INPUT_TEST_ID).clear().type(VALID_PASSWORD);
    cy.contains(/Entrar/i).should('be.disabled');

    cy.getByTestId(EMAIL_INPUT_TEST_ID).clear().type(INVALID_EMAIL_3);
    cy.getByTestId(PASSWORD_INPUT_TEST_ID).clear().type(VALID_PASSWORD);
    cy.contains(/Entrar/i).should('be.disabled');

    cy.getByTestId(EMAIL_INPUT_TEST_ID).clear().type(VALID_EMAIL);
    cy.getByTestId(PASSWORD_INPUT_TEST_ID).clear().type(INVALID_PASSWORD);
    cy.contains(/Entrar/i).should('be.disabled');

    cy.getByTestId(EMAIL_INPUT_TEST_ID).clear().type(VALID_EMAIL);
    cy.getByTestId(PASSWORD_INPUT_TEST_ID).clear().type(VALID_PASSWORD);
    cy.contains(/Entrar/i).should('not.be.disabled');
  });

  it('Salve o email no estado da aplicação, com a chave email, assim que o usuário logar.', () => {
    logInWithValidCredentials();

    cy.window().its('store').invoke('getState')
      .its('user.email')
      .should('eq', VALID_EMAIL);
  });

  it('A rota deve ser mudada para \'/carteira\' após o clique no botão.', () => {
    logInWithValidCredentials();

    cy.location('pathname').should('eq', '/carteira');
  });
});
