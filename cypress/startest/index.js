import StartestError from './customError';

/**
 * Função responsável por criar mensagens de erro para o usuário de um case sobrevivente.
 * @callback logCreatorCallback
 * @param {string} propKey - Nome da chave da prop
 * @param {string} defaultProp - Valor default da prop
 * @param {string} prop - Valor da prop
 * @returns {(string|string[])} - Mensagem de log ou array de mensagens de log
 * @example
 * const logCreatorCallback = (_propKey, defaultProp, prop) => (
 *  [`❌ data-testid: '${defaultProp}' ❌`, `✅ data-testid: '${prop}' ✅`]
 * );
 */

/**
 * Objeto populado por {@link logCreatorCallback} para cada prop específica e opcionalmente um default
 * @typedef {Object} logCreators
 * @property {...logCreatorCallback|...string} propKey - Nome da chave das props com seus respectivos logCreatorCallbacks ou strings que serão utilizadas como propName na função default log creator
 * @property {logCreatorCallback|string} [default=defaultLogCreator] - Criador de logs default para todas as props. Defaults to {@link defaultLogCreator}.
 */

/**
 * Função usada como logCreator default para todos os teste cases, ao {@link addTestCases adicionar um caso de teste} pode ser sobrescrita com o parâmetro logCreator ou pode receber uma nova propName ao passar uma string como parâmetro logCreator.
 * @callback
 * @param {string} _propKey - Chave da prop do caso de teste
 * @param {string} defaultProp - Valor padrão da prop
 * @param {string} prop - Valor da prop do caso de teste
 * @param {string} propName=data-testid - String com o nome da prop passada no lugar de uma {@link logCreatorCallback} ao {@link addTestCases adicionar um caso de teste}
 * @returns {array<string>} - Retorna um array de strings com o log do caso de teste
 * @example
 * const DEFAULT_LOG_CREATOR = (_propKey, defaultProp, prop, propName = 'data-testid') => (
 *   [`❌ ${propName}: '${defaultProp}' ❌`, `✅ ${propName}: '${prop}' ✅`]
 * );
 */
const DEFAULT_LOG_CREATOR = (_propKey, defaultProp, prop, propName = 'data-testid') => (
  [`❌ ${propName}: '${defaultProp}' ❌`, `✅ ${propName}: '${prop}' ✅`]
);

/**
 * @class Startest - Classe utilizada para criar cada mock individual e executar todos os seus testes cases
 * @param {Object} config - Objeto com as configurações do Startest
 * @param {string} config.testFileName - Nome do arquivo de teste da pessoa estudante
 * @param {string} config.componentPath - Caminho do componente Original da pessoa estudante a ser mockado
 * @param {Object} config.defaultProps - Propriedades padrão que serão passadas para o componente mockado ❗Todas propriedades devem ser {@link https://developer.mozilla.org/en-US/docs/Glossary/Serialization serializáveis} para JSON❗
 * @param {string} config.mockName - Nome do arquivo de mock definido na pasta `startest > mockComponents`
 */
class Startest {
  #allCases = {};

  #allResults = {};

  #config;

  constructor(
    { testFileName, componentPath, mockName, defaultProps },
  ) {
    this.#config = {
      testFileName,
      componentPath,
      mockName,
      defaultProps,
    };
  }

  #log(message, { displayName = '[Startest]', console = {} } = {}) {
    if (Array.isArray(message)) {
      return message.forEach((msg) => {
        this.#log(msg, { displayName });
      });
    }

    Cypress.log({
      name: '[Startest]',
      message,
      displayName,
      consoleProps: () => console,
    });
  }

  async #runTest(testKeyWord) {
    this.#log('⏳ Executando testes ⏳');
    const { cases } = this.#allCases[testKeyWord];

    this.#allResults[testKeyWord] = await cy.task('runTest', {
      ...this.#config,
      testKeyWord,
      cases,
    }, { log: false, timeout: 600000 });

    this.#log('💡 Testes finalizados 💡');
  }

  #logSurvivorsCases(survivorCase, testKeyWord) {
    const { cases, logCreator } = this.#allCases[testKeyWord];

    const caseIndex = cases.indexOf(survivorCase);
    const strCase = `Case Nº${caseIndex}`;

    this.#log(`➖ ➖ ${strCase} ➖ ➖`, { displayName: testKeyWord });

    Object.entries(survivorCase).forEach(([key, value]) => {
      const defaultProp = this.#config.defaultProps[key];
      let creatorFunc = logCreator;
      let propName;

      if (typeof logCreator !== 'function') {
        creatorFunc = logCreator[key] || logCreator.default || DEFAULT_LOG_CREATOR;
        if (typeof creatorFunc === 'string') {
          propName = creatorFunc;
          creatorFunc = typeof logCreator.default === 'function' ? logCreator.default : DEFAULT_LOG_CREATOR;
        }
      }

      this.#log(
        creatorFunc(key, defaultProp, value, propName),
        { displayName: strCase },
      );
    });
  }

  #logTestResult(result, testKeyWord) {
    const { survivors, killed } = result;
    const { cases } = this.#allCases[testKeyWord];

    this.#log(
      `🎃 ${survivors.length} Sobrevive${survivors.length === 1 ? 'u' : 'ram'} 🎃
      | 💀 ${killed} Morre${killed === 1 ? 'u' : 'ram'} 💀`,
      {
        displayName: testKeyWord,
        console: {
          survivors,
          test: {
            results: this.#allResults[testKeyWord],
            cases,
          },
        },
      },
    );
  }

  #throwSurvivorsError(survivors) {
    throw new StartestError(
      `💀 Teste falhou 💀
${survivors} caso${survivors === 1 ? '' : 's'} sobrevive${survivors === 1 ? 'u' : 'ram'}`,
    );
  }

  #calculateResult(testKeyWord) {
    const { cases } = this.#allCases[testKeyWord];
    const testResults = this.#allResults[testKeyWord];

    const result = testResults.reduce((acc, curr, index) => {
      if (curr.numPassedTestSuites > 0) {
        acc.survivors.push(cases[index]);
      } else {
        acc.killed += 1;
      }
      return acc;
    }, { survivors: [], killed: 0 });

    return result;
  }

  /**
   * Adiciona um novo caso de teste ao mock
   * @instance
   * @param {!array} cases - Array de objetos com os casos de testes
   * @param {(logCreatorCallback|logCreators|string)} [logCreator=DEFAULT_LOG_CREATOR] - Parâmetro usado para personalizar a mensagem de log.
   * @param {!string} [testKeyWord=🌟] - Palavra chave utilizada no describe do teste da pessoa estudante (ex: 'Req 1')
   * Será utilizado como propName na callback {@link DEFAULT_LOG_CREATOR} caso seja passado uma string.
   */
  addTestCases(
    cases = [], logCreator = DEFAULT_LOG_CREATOR, testKeyWord = '🌟',
  ) {
    if (!Array.isArray(cases)) throw new Error('"cases" must be an array');
    if (this.#allCases[testKeyWord]) {
      this.#allCases[testKeyWord].push(...cases);
    } else {
      this.#allCases[testKeyWord] = { cases, logCreator };
    }
  }

  /**
   * Função que remove um caso de teste do Startest
   * @instance
   * @param {!string} [testKeyWord=🌟] - Palavra chave utilizada para identificar os cases (ex: 'Req 1')
   */
  removeTestCase(testKeyWord = '🌟') {
    if (testKeyWord) {
      delete this.#allCases[testKeyWord];
    }
  }

  /**
   * Função que executa um teste específico e exibe o resultado
   * @instance
   * @param {!string} [testKeyWord=🌟] - Palavra chave utilizada para identificar os cases (ex: 'Req 1')
   * @returns {Promise<Object>} - Retorna um objeto com um array de casos que sobreviveram e o número de casos que morreram
   * @throws {StartestError} - Caso algum caso de teste falhe
   */
  async showTestResult(testKeyWord = '🌟') {
    if (!this.#allResults[testKeyWord]) {
      await this.#runTest(testKeyWord);
    }

    const { error } = this.#allResults[testKeyWord];
    if (error) {
      const { message, ...console } = error;
      this.#log(message, { displayName: testKeyWord, console });
      throw new StartestError(error.message);
    }

    const result = this.#calculateResult(testKeyWord);

    this.#logTestResult(result, testKeyWord);
    const { survivors } = result;
    survivors.forEach((survivorCase) => {
      this.#logSurvivorsCases(survivorCase, testKeyWord);
    });

    if (survivors.length > 0) {
      this.#throwSurvivorsError(survivors.length);
    }

    return result;
  }

  /**
   * Função que adiciona e executa um teste específico e exibe o resultado
   * @instance
   * @param {!array} cases - Array de objetos com os casos de testes
   * @param {(logCreatorCallback|logCreators|string)} [logCreator=DEFAULT_LOG_CREATOR] - Parâmetro usado para personalizar a mensagem de log.
   * Será utilizado como propName na callback {@link DEFAULT_LOG_CREATOR} caso seja passado uma string.
   * @param {string} [testKeyWord=🌟] - Palavra chave utilizada para identificar os cases de um mesmo mock componente (ex: 'Req 1')
   * @returns {Promise<Object>} - Retorna um objeto com um array de casos que sobreviveram e o número de casos que morreram
   * @throws {StartestError} - Caso algum caso de teste falhe
   */
  runTestCases(
    cases = [], logCreator = DEFAULT_LOG_CREATOR, testKeyWord = '🌟',
  ) {
    this.addTestCases(cases, logCreator);
    return this.showTestResult(testKeyWord);
  }
}

export default Startest;
