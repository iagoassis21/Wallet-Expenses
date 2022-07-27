/// <reference types="cypress" />

import { tableHeaderList } from '../utils/constants';
import mockFetch from '../mocks/fetch';
import { logInWithValidCredentials } from '../utils/helperFunctions';

describe('6 - Desenvolva uma tabela com os gastos contendo as seguintes características:', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/', {
      onBeforeLoad(win) {
        cy.stub(win, 'fetch').callsFake(mockFetch);
      },
    });

    logInWithValidCredentials();
  });

  it('A tabela deve possuir um cabeçalho com os campos Descrição, Tag, Método de pagamento, Valor, Moeda, Câmbio utilizado, Valor convertido e Moeda de conversão', () => {
    cy.get('th').should('have.length', tableHeaderList.length);

    cy.wrap(tableHeaderList).each((header) => {
      cy.get('th').contains(header);
    });
  });
});
