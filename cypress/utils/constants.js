import { mockData } from '../mocks/data';

export const VALID_EMAIL = 'alguem@email.com';
export const VALID_PASSWORD = '123456';
export const INVALID_EMAIL_0 = 'email';
export const INVALID_EMAIL_1 = 'email@com@';
export const INVALID_EMAIL_2 = 'emailcom@';
export const INVALID_EMAIL_3 = 'alguem@email.';
export const INVALID_PASSWORD = '23456';

export const EMAIL_INPUT_TEST_ID = 'email-input';
export const PASSWORD_INPUT_TEST_ID = 'password-input';
export const EMAIL_FIELD_TEST_ID = 'email-field';
export const HEADER_CURRENCY_FIELD_TEST_ID = 'header-currency-field';
export const CURRENCY_INPUT_TEST_ID = 'currency-input';
export const VALUE_INPUT_TEST_ID = 'value-input';
export const METHOD_INPUT_TEST_ID = 'method-input';
export const TAG_INPUT_TEST_ID = 'tag-input';
export const BTN_DELETE_TEST_ID = 'delete-btn';
export const DESCRIPTION_INPUT_TEST_ID = 'description-input';
export const TOTAL_FIELD_TEST_ID = 'total-field';
export const EDIT_INPUT_TEST_ID = 'edit-btn';
export const BTN_EDIT_TEST_ID = 'edit-btn';

export const methodOptions = [
  'Dinheiro',
  'Cartão de crédito',
  'Cartão de débito',
];

export const tagOptions = [
  'Alimentação',
  'Lazer',
  'Trabalho',
  'Transporte',
  'Saúde',
];

export const tableHeaderList = [
  'Descrição', 'Tag', 'Método de pagamento',
  'Valor', 'Moeda', 'Câmbio utilizado',
  'Valor convertido', 'Moeda de conversão', 'Editar/Excluir',
];

export const initialExpenses = [
  {
    description: 'Dez dólares',
    value: '10',
    currency: 'USD',
    method: 'Cartão de débito',
    tag: 'Trabalho',
  },
  {
    description: 'Cinco euros',
    value: '5',
    currency: 'EUR',
    method: 'Cartão de crédito',
    tag: 'Lazer',
  },
];

export const currenciesOptions = Object.keys(mockData).filter((key) => key !== 'USDT');
