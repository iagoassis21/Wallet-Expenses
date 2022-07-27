/// <reference types="cypress" />

import { mockData } from '../mocks/data';
import mockFetch from '../mocks/fetch';
import { BTN_EDIT_TEST_ID, initialExpenses, TOTAL_FIELD_TEST_ID } from '../utils/constants';
import { addExpense, editExpense, logInWithValidCredentials } from '../utils/helperFunctions';

describe('9 - Crie um botão para editar uma despesa da tabela contendo as seguintes características:', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/', {
      onBeforeLoad(win) {
        cy.stub(win, 'fetch').callsFake(mockFetch);
      },
    });

    logInWithValidCredentials();
    addExpense(initialExpenses);
  });

  it('O botão deve estar dentro do último item da linha da tabela e deve possuir `data-testid="edit-btn"`', () => {
    cy.get('tbody tr').first().find('td').last()
      .find(`button[data-testid="${BTN_EDIT_TEST_ID}"]`)
      .should('exist');

    cy.getByTestId(BTN_EDIT_TEST_ID).should('have.length', 2);
  });

  it('O botão habilita um formulário para editar a linha da tabela ao ser clicado, '
    + 'após clicar em "Editar despesa" a despesa é atualizada e atualiza a soma de despesas no header.', () => {
    cy.getByTestId(BTN_EDIT_TEST_ID).first().click();

    cy.contains(/Adicionar despesa/i).should('not.exist');
    cy.contains(/Editar despesa/i).should('exist');

    editExpense({
      value: '200',
      currency: 'CAD',
      method: 'Dinheiro',
      tag: 'Saúde',
      description: 'Duzentos dólares canadenses',
    });

    const expectedTableRow = [
      'Duzentos dólares canadenses', 'Saúde', 'Dinheiro',
      '200.00', 'Dólar Canadense/Real Brasileiro', '3.76', '751.18', 'Real',
    ];
    const deleteBtn = 1;

    cy.get('tbody tr').first().find('td').should('have.length', expectedTableRow.length + deleteBtn);

    cy.wrap(expectedTableRow).each((expectedValue) => {
      cy.get('tbody tr').first().find('td').contains(expectedValue);
    });

    cy.getByTestId(TOTAL_FIELD_TEST_ID).should('have.text', '776.81');

    const expectedExpenses = [
      {
        id: 0,
        value: '200',
        currency: 'CAD',
        method: 'Dinheiro',
        tag: 'Saúde',
        description: 'Duzentos dólares canadenses',
        exchangeRates: mockData,
      },
      {
        ...initialExpenses[1],
        id: 1,
        exchangeRates: mockData,
      },
    ];

    cy.window().its('store').invoke('getState').its('wallet.expenses')
      .should('deep.equal', expectedExpenses);
  });
});
