import {
  CURRENCY_INPUT_TEST_ID,
  DESCRIPTION_INPUT_TEST_ID,
  EMAIL_INPUT_TEST_ID,
  METHOD_INPUT_TEST_ID,
  PASSWORD_INPUT_TEST_ID,
  TAG_INPUT_TEST_ID,
  VALID_EMAIL,
  VALID_PASSWORD,
  VALUE_INPUT_TEST_ID } from './constants';

function fillExpenseForm({ description, value, method, tag, currency }) {
  cy.getByTestId(VALUE_INPUT_TEST_ID).clear().type(value);
  cy.getByTestId(CURRENCY_INPUT_TEST_ID).select(currency);
  cy.getByTestId(METHOD_INPUT_TEST_ID).select(method);
  cy.getByTestId(TAG_INPUT_TEST_ID).select(tag);
  cy.getByTestId(DESCRIPTION_INPUT_TEST_ID).clear().type(description);
}

/**
 * Add a new expense to the page using input fields.
 * @example
 * addExpense({
 *  value: '20',
 *  currency: 'EUR',
 *  method: 'Cartão de débito',
 *  tag: 'Trabalho',
 *  description: 'Vinte euros'
 * })
 */
export function addExpense(data) {
  if (Array.isArray(data)) {
    return data.forEach(addExpense);
  }

  fillExpenseForm(data);
  cy.contains(/Adicionar despesa/i).click();
}

/**
 * Fill the expense form using input fields and click on the edit button.
 * @example
 * editExpense({
 *  value: '20',
 *  currency: 'EUR',
 *  method: 'Cartão de débito',
 *  tag: 'Trabalho',
 *  description: 'Vinte euros'
 * })
 */
export function editExpense(data) {
  fillExpenseForm(data);
  cy.contains(/Editar despesa/i).click();
}

/**
 * Login to the application using input fields.
 */
export function logInWithValidCredentials() {
  cy.getByTestId(EMAIL_INPUT_TEST_ID).clear().type(VALID_EMAIL);
  cy.getByTestId(PASSWORD_INPUT_TEST_ID).clear().type(VALID_PASSWORD);
  cy.contains(/Entrar/i).click();
}
