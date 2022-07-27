import Startest from "../../startest";
import { BTN_DELETE_TEST_ID } from "../../utils/constants";

describe('Requisito 8 Startest não avaliativo', () => {
  it('🌟 Startest - Desenvolva os testes automatizados do requisito 8 com relação ao componente Table', async () => {
    const walletStartest = new Startest({
      testFileName: '08.star.test.js',
      componentPath: 'src/components/Table',
      mockName: 'Table',
      defaultProps: {
        shouldRenderDelBtn: true,
        btnDeleteTestId: BTN_DELETE_TEST_ID,
        shouldRemoveFromStore: true,
        shouldRemoveFromScreen: true,
      },
    });

    const testCases = [
      { shouldRenderDelBtn: false },
      { btnDeleteTestId: '' },
      { shouldRemoveFromStore: false, shouldRemoveFromScreen: false },
      { shouldRemoveFromStore: false },
      { shouldRemoveFromScreen: false },
    ];

    const logCreators = {
      shouldRenderDelBtn: () => 'Botão de exclusão não foi renderizado',
      shouldRemoveFromStore: () => 'Despesa não foi removida do estado global',
      shouldRemoveFromScreen: () => 'A despesa continua sendo exibida na tabela',
    };

    await walletStartest.runTestCases(testCases, logCreators);
  });

  it('🌟 Startest - Desenvolva os testes automatizados do requisito 8 com relação ao componente Header', async () => {
    const headerStartest = new Startest({
      testFileName: '08.star.test.js',
      componentPath: 'src/components/header',
      mockName: 'HeaderDelete',
      defaultProps: {
        isTotalCorrect: true,
        shouldUpdateTotal: true,
      },
    });

    const testCases = [
      { isTotalCorrect: false },
      { shouldUpdateTotal: false },
    ];

    const logCreators = {
      isTotalCorrect: () => 'Total do Header está incorreto',
      shouldUpdateTotal: () => 'Total do Header não foi atualizado',
    };

    await headerStartest.runTestCases(testCases, logCreators);
  });
})
