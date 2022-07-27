/// <reference types="cypress" />

import { mockData } from '../mocks/data';
import mockFetch from '../mocks/fetch';
import {
  DESCRIPTION_INPUT_TEST_ID,
  TOTAL_FIELD_TEST_ID,
  VALUE_INPUT_TEST_ID,
} from '../utils/constants';
import { addExpense, logInWithValidCredentials } from '../utils/helperFunctions';

describe('4 - Salve todas as informações do formulário no estado global', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/', {
      onBeforeLoad(win) {
        cy.stub(win, 'fetch').callsFake(mockFetch).as('mockFetch');
      },
    });

    logInWithValidCredentials();
  });

  it('Adiciona uma despesa e verifica se a soma de despesas do header foi atualizada e os inputs voltaram ao valor inicial', () => {
    const expense = {
      value: '11',
      currency: 'USD',
      method: 'Cartão de crédito',
      tag: 'Lazer',
      description: 'Onze dólares',
    };

    addExpense(expense);

    cy.getByTestId(TOTAL_FIELD_TEST_ID).should('have.text', '52.28');

    cy.getByTestId(VALUE_INPUT_TEST_ID).should('have.value', '');
    cy.getByTestId(DESCRIPTION_INPUT_TEST_ID).should('have.value', '');
  });

  it('Adiciona uma despesa e verifica se a despesa foi salva no estado global', () => {
    const expense = {
      value: '11',
      currency: 'USD',
      method: 'Cartão de crédito',
      tag: 'Lazer',
      description: 'Onze dólares',
    };

    addExpense(expense);

    cy.window().its('store').invoke('getState')
      .its('wallet.expenses')
      .should('deep.equal', [
        {
          ...expense,
          id: 0,
          exchangeRates: mockData,
        },
      ]);
  });

  it('Verifica se a API é chamada a cada vez que o botão \'Adicionar despesa\' é clicado', () => {
    const expense = {
      value: '11',
      currency: 'USD',
      method: 'Cartão de crédito',
      tag: 'Lazer',
      description: 'Onze dólares',
    };

    cy.get('@mockFetch').should('be.calledOnce');

    addExpense(expense);

    cy.get('@mockFetch').should('be.calledTwice');

    addExpense(expense);

    cy.get('@mockFetch').should('be.calledThrice');
  });

  it('Adiciona duas despesas e verifica se o estado global e header foram atualizados', () => {
    const firstExpense = {
      id: 0,
      value: '11',
      currency: 'USD',
      method: 'Cartão de crédito',
      tag: 'Lazer',
      description: 'Onze dólares',
      exchangeRates: mockData,
    };

    addExpense(firstExpense);

    cy.window().its('store').invoke('getState')
      .its('wallet.expenses')
      .should('deep.equal', [firstExpense]);

    const secondExpense = {
      id: 1,
      value: '20',
      currency: 'EUR',
      method: 'Cartão de débito',
      tag: 'Trabalho',
      description: 'Vinte euros',
      exchangeRates: mockData,
    };

    addExpense(secondExpense);

    cy.window().its('store').invoke('getState')
      .its('wallet.expenses')
      .should('deep.equal', [firstExpense, secondExpense]);

    cy.getByTestId(TOTAL_FIELD_TEST_ID).should('have.text', '154.82');
  });
});
