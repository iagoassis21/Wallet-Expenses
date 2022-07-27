import Startest from "../../startest";
import { TOTAL_FIELD_TEST_ID } from "../../utils/constants";

describe('Requisito 4 Startest não avaliativo', () => {
  it('🌟 Startest - Desenvolva os testes automatizados do requisito 4 com relação ao componente WalletForm', async () => {
    const walletStartest = new Startest({
      testFileName: '04.star.test.js',
      componentPath: 'src/components/WalletForm',
      mockName: 'WalletFormSave',
      defaultProps: {
        renderSubmitBtn: true,
        shouldDispatchNewExpense: true,
        shouldClearInputs: true,
        shouldIncrementId: true,
      },
    });

    const testCases = [
      { renderSubmitBtn: false },
      { shouldDispatchNewExpense: false },
      { shouldClearInputs: false, shouldIncrementId: false },
      { shouldClearInputs: false },
      { shouldIncrementId: false },
    ];

    const logCreators = {
      shouldClearInputs: () => 'Campos do formulário não estão sendo limpos',
      shouldIncrementId: () => 'Id da despesa não está sendo incrementado',
      renderSubmitBtn: () => 'Botão de "Adicionar despesa" não foi renderizado',
      shouldDispatchNewExpense: () => 'Despesa não foi adicionada ao estado global',
    };

    await walletStartest.runTestCases(testCases, logCreators);
  });

  it('🌟 Startest - Desenvolva os testes automatizados do requisito 4 com relação ao componente Header', async () => {
    const headerStartest = new Startest({
      testFileName: '04.star.test.js',
      componentPath: 'src/components/Header',
      mockName: 'Header',
      defaultProps: {
        totalFieldTestId: TOTAL_FIELD_TEST_ID,
        shouldRenderTotal: true,
        isTotalCorrect: true,
        decimalCount: 2,
      },
    });

    const testCases = [
      { totalFieldTestId: '' },
      { shouldRenderTotal: false },
      { isTotalCorrect: false },
      { decimalCount: 0 },
      { decimalCount: 3 },
    ];

    const logCreators = {
      shouldRenderTotal: () => 'O valor total não foi renderizado',
      isTotalCorrect: () => 'Valor total está incorreto',
      decimalCount: 'Número de casas decimais',
    };

    await headerStartest.runTestCases(testCases, logCreators);
  });
})
