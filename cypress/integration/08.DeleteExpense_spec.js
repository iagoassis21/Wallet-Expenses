/// <reference types="cypress" />

import { mockData } from '../mocks/data';
import mockFetch from '../mocks/fetch';
import { BTN_DELETE_TEST_ID, initialExpenses, TOTAL_FIELD_TEST_ID } from '../utils/constants';
import { addExpense, logInWithValidCredentials } from '../utils/helperFunctions';

describe('8 - Crie um botão para deletar uma despesa da tabela contendo as seguintes características:', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/', {
      onBeforeLoad(win) {
        cy.stub(win, 'fetch').callsFake(mockFetch);
      },
    });

    logInWithValidCredentials();
    addExpense(initialExpenses);
  });

  it('O botão deve estar dentro do último item da linha da tabela e deve possuir `data-testid="delete-btn"`', () => {
    cy.get('tbody tr').first().find('td').last()
      .find(`button[data-testid="${BTN_DELETE_TEST_ID}"]`)
      .should('exist');

    cy.getByTestId(BTN_DELETE_TEST_ID).should('have.length', 2);
  });

  it('Ao ser clicado, o botão deleta a linha da tabela, alterando o estado global.', () => {
    const expectedTableRow = [
      'Cinco euros', 'Lazer', 'Cartão de crédito',
      '5.00', 'Euro/Real Brasileiro', '5.13', '25.63', 'Real',
    ];
    cy.getByTestId(BTN_DELETE_TEST_ID).first().click().should('not.exist');

    const deleteBtn = 1;
    cy.get('tbody tr td').should('have.length', expectedTableRow.length + deleteBtn);

    cy.wrap(expectedTableRow).each((expectedValue) => {
      cy.get('tbody tr td').contains(expectedValue);
    });

    const expectedExpenses = [
      {
        ...initialExpenses[1],
        id: 1,
        exchangeRates: mockData,
      },
    ];

    cy.window().its('store').invoke('getState').its('wallet.expenses')
      .should('deep.equal', expectedExpenses);
  });

  it('Ao clicar no botão para remover uma despesa, o valor correspondente deve ser subtraído e a despesa total deve ser atualizada no header', () => {
    cy.getByTestId(TOTAL_FIELD_TEST_ID).should('have.text', '73.16');

    cy.getByTestId(BTN_DELETE_TEST_ID).first().click();

    cy.getByTestId(TOTAL_FIELD_TEST_ID).should('have.text', '25.63');

    cy.getByTestId(BTN_DELETE_TEST_ID).first().click();

    cy.getByTestId(TOTAL_FIELD_TEST_ID).should('have.text', '0.00');
  });
});
