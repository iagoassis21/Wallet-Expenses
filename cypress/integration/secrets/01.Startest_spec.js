import Startest from "../../startest";
import { EMAIL_INPUT_TEST_ID, PASSWORD_INPUT_TEST_ID } from "../../utils/constants";

describe('Requisito 1 Startest não avaliativo', () => {
  it('🌟 Startest - Desenvolva os testes automatizados do requisito 1', async () => {
    const loginStartest = new Startest({
      testFileName: '01.star.test.js',
      componentPath: 'src/pages/Login',
      mockName: 'Login',
      defaultProps: {
        initialRoute: '/',
        emailTestId: EMAIL_INPUT_TEST_ID,
        passwordTestId: PASSWORD_INPUT_TEST_ID,
        btnText: 'Entrar',
        btnAlwaysEnabled: false,
        emailAlwaysInvalid: false,
        passwordAlwaysInvalid: false,
        minPasswordLength: 6,
        emailValidationBug: false,
        shouldDispatch: true,
        onSubmitRedirect: '/carteira',
      },
    });

    const testCases = [
      { initialRoute: '/invalidRoute' },
      { emailTestId: '' },
      { passwordTestId: '' },
      { btnText: '' },
      { btnAlwaysEnabled: true },
      { emailAlwaysInvalid: true },
      { passwordAlwaysInvalid: true },
      { minPasswordLength: 0, emailValidationBug: true },
      { emailValidationBug: true },
      { minPasswordLength: 0 },
      { shouldDispatch: false },
      { onSubmitRedirect: '/' },
    ];

    const logCreators = {
      btnText: 'Texto do botão',
      initialRoute: 'Rota inicial',
      btnAlwaysEnabled: () => 'Botão está sempre habilitado',
      emailAlwaysInvalid: () => 'Validação do email nunca funciona',
      passwordAlwaysInvalid: () => 'Validação da senha nunca funciona',
      minPasswordLength: () => 'Validação da senha não está funcionando corretamente',
      emailValidationBug: () => 'Validação do email não está funcionando corretamente',
      shouldDispatch: () => 'Email não foi salvo na store',
      onSubmitRedirect: 'Redirecionamento após o submit',
    };

    await loginStartest.runTestCases(testCases, logCreators);
  });
})
