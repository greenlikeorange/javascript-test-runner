import { exists } from "fs";
import { join } from "path";

import { ITestRunnerInterface } from "../interfaces/ITestRunnerInterface";
import { ConfigurationProvider } from "../providers/ConfigurationProvider";
import { TerminalProvider } from "../providers/TerminalProvider";
import { JestTestRunner } from "./JestTestRunner";
import { MochaTestRunner } from "./MochaTestRunner";

function doesFileExist(filePath: string): Promise<boolean> {
  return new Promise(resolve => {
    exists(filePath, doesExist => {
      resolve(doesExist);
    });
  });
}

async function getAvailableTestRunner(
  testRunners: ITestRunnerInterface[],
  rootPath: string
): Promise<ITestRunnerInterface> {
  for (const runner of testRunners) {
    const doesRunnerExist = await doesFileExist(join(rootPath, runner.binPath));

    if (doesRunnerExist) {
      return runner;
    }
  }

  throw new Error("No test runner in your project. Please install one.");
}

export async function getTestRunner(
  rootPath: string
): Promise<ITestRunnerInterface> {
  const configurationProvider = new ConfigurationProvider();
  const environmentVariables = configurationProvider.environmentVariables;
  const terminalProvider = new TerminalProvider(
    {
      env: environmentVariables
    },
    rootPath
  );

  const jestTestRunner = new JestTestRunner({
    configurationProvider,
    terminalProvider
  });
  const mochaTestRunner = new MochaTestRunner({
    configurationProvider,
    terminalProvider
  });

  return getAvailableTestRunner([jestTestRunner, mochaTestRunner], rootPath);
}
