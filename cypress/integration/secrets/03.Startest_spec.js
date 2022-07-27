import Startest from "../../startest";
import { CURRENCY_INPUT_TEST_ID, DESCRIPTION_INPUT_TEST_ID, METHOD_INPUT_TEST_ID, TAG_INPUT_TEST_ID, VALUE_INPUT_TEST_ID } from "../../utils/constants";

describe('Requisito 3 Startest não avaliativo', () => {
  it('🌟 Startest - Desenvolva os testes automatizados do requisito 3', async () => {
    const walletStartest = new Startest({
      testFileName: '03.star.test.js',
      componentPath: 'src/components/WalletForm',
      mockName: 'WalletForm',
      defaultProps: {
        valueTestId: VALUE_INPUT_TEST_ID,
        descriptionTestId: DESCRIPTION_INPUT_TEST_ID,
        methodTestId: METHOD_INPUT_TEST_ID,
        currencyTestId: CURRENCY_INPUT_TEST_ID,
        tagTestId: TAG_INPUT_TEST_ID,
        methodOptions,
        tagOptions,
        shouldFetchCurrencies: true,
        shouldDispatchCurrencies: true,
      },
    });

    const testCases = [
      { valueTestId: '' },
      { descriptionTestId: '' },
      { methodTestId: '' },
      { currencyTestId: '' },
      { tagTestId: '' },
      { methodOptions: [] },
      { tagOptions: [] },
      { shouldFetchCurrencies: false },
      { shouldDispatchCurrencies: false },
    ];

    const logCreators = {
      methodOptions: 'Métodos de pagamento',
      tagOptions: 'Opções de tags',
      shouldFetchCurrencies: () => 'Fetch de currencies não está sendo realizado',
      shouldDispatchCurrencies: () => 'Currencies não estão sendo salvas no redux',
    };

    await walletStartest.runTestCases(testCases, logCreators);
  });
})
