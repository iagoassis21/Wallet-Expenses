const util = require('util');

const exec = util.promisify(require('child_process').exec);
const accessFile = util.promisify(require('fs').access);

const NPM_TEST = 'npm test';
const DEFAULT_ARGS = '--watchAll=false --json --testFailureExitCode=0';
const SETUP_ARG = '--setupFilesAfterEnv "<rootDir>/cypress/startest/jestSetup.js"';

function getJsonOutput({ stdout }) {
  return JSON.parse(stdout.replace(/(\n|.)*\n\n({.*}).*/, '$2'));
}

function getFailedTest({ testResults }) {
  return testResults.find(({ status }) => status === 'failed')
    .message.replace(/.\[\d+m/gm, '');
}

async function checkIfFileExists(componentPath) {
  const fileExtensions = ['', '.js', '.jsx'];
  for (const fileExtension of fileExtensions) {
    try {
      await accessFile(`${componentPath}${fileExtension}`);
      return;
    } catch (err) {
      // do nothing
    }
  }
  const error = {
    message: `🚨 Arquivo "${componentPath}" não encontrado 🚨`,
  };
  throw error;
}

async function execInitialTest(testInfo) {
  const {
    command, componentPath, mockName, defaultProps,
  } = testInfo;

  await checkIfFileExists(componentPath);

  const initialEnv = {
    ...process.env,
    props: JSON.stringify(defaultProps),
    componentPath,
    mockName,
  };

  const initialPromises = [
    exec(`${command} ${SETUP_ARG}`, { env: initialEnv }).then(getJsonOutput),
    exec(`${command}`, { env: initialEnv }).then(getJsonOutput),
  ];
  const [testWithMock, testWithoutMock] = await Promise.all(initialPromises)
    .catch((err) => {
      const error = {
        message: `🚨 Teste inicial falhou 🚨\n\n${err.message.replace(/.\[\d+m/gm, '')}`,
        data: {
          env: {
            props: defaultProps,
            componentPath,
            mockName,
          },
          command,
        },
      };
      throw error;
    });

  const data = {
    testWithMock,
    testWithoutMock,
    env: {
      props: defaultProps,
      componentPath,
      mockName,
    },
    command,
  };

  if (testWithMock.numTotalTests === testWithMock.numPendingTests) {
    const error = {
      message: '⏩ Não há testes para serem executados.⏩',
      data,
    };
    throw error;
  }

  const failedWithoutMock = testWithoutMock.numFailedTests > 0;
  const failedWithMock = testWithMock.numFailedTests > 0;

  if (failedWithoutMock || failedWithMock) {
    const error = {
      message: [
        '🚨 Um ou mais testes falharam na inicialização.\n',
        (failedWithoutMock ? '🚨 Verifique se os testes estão funcionando corretamente com "npm test".\n' : ''),
        (failedWithMock && !failedWithoutMock ? '🚨 O erro NÃO está na sua aplicação\n'
          + '🚨 Possivelmente seu teste está testando algo fora do escopo do requisito ou existe alguma inconsistência no seu teste\n'
          + '🚨 Mova testes que estão fora do escopo do requisito para outro arquivo\n' : ''
        ),
        '\n',
        getFailedTest(failedWithoutMock ? testWithoutMock : testWithMock),
      ].join(''),
      data,
    };
    throw error;
  }
}

async function execTestCases(testInfo) {
  const {
    command, cases, componentPath, mockName, defaultProps,
  } = testInfo;

  const jsonOutputs = await cases.reduce(async (lastPromise, testCase) => {
    const env = {
      ...process.env,
      props: JSON.stringify({
        ...defaultProps,
        ...testCase,
      }),
      componentPath,
      mockName,
    };

    const curr = await lastPromise; // Mudar a ordem desses 2 awaits faz com que todos os cases sejam executados simultaneamente
    const result = await exec(`${command} ${SETUP_ARG}`, { env });

    return [...curr, getJsonOutput(result)];
  }, []);

  return jsonOutputs;
}

async function runTest(testData) {
  try {
    const { testFileName } = testData;

    const testInfo = {
      command: `${NPM_TEST} ${testFileName} -- ${DEFAULT_ARGS}`,
      ...testData,
    };

    await execInitialTest(testInfo);
    const testResult = await execTestCases(testInfo);

    return testResult;
  } catch ({ message, ...error }) {
    return { error: { message, ...error } };
  }
}

module.exports = {
  runTest,
};
