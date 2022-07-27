/// <reference types="cypress" />

import mockFetch from '../mocks/fetch';
import { initialExpenses } from '../utils/constants';
import { addExpense, logInWithValidCredentials } from '../utils/helperFunctions';

describe('7 - Implemente a lógica para que a tabela seja alimentada pelo estado da aplicação', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/', {
      onBeforeLoad(win) {
        cy.stub(win, 'fetch').callsFake(mockFetch);
      },
    });

    logInWithValidCredentials();
    addExpense(initialExpenses);
  });

  it('A tabela deve ser alimentada pelo estado da aplicação, que estará disponível na chave expenses que vem do reducer wallet.', () => {
    const expectedTableRows = [
      ['Dez dólares', 'Trabalho', 'Cartão de débito', '10.00', 'Dólar Americano/Real Brasileiro', '4.75', '47.53', 'Real'],
      ['Cinco euros', 'Lazer', 'Cartão de crédito', '5.00', 'Euro/Real Brasileiro', '5.13', '25.63', 'Real'],
    ];
    cy.get('tbody tr').should('have.length', expectedTableRows.length);

    cy.get('tbody tr').each((row, index) => {
      cy.wrap(expectedTableRows[index]).each((expectedValue) => {
        cy.get(row).find('td').contains(expectedValue);
      });
    });
  });
});
