import { join } from "path";
import { debug } from "vscode";

import { ITestRunnerInterface } from "../interfaces/ITestRunnerInterface";
import { ITestRunnerOptions } from "../interfaces/ITestRunnerOptions";
import { ConfigurationProvider } from "../providers/ConfigurationProvider";
import { TerminalProvider } from "../providers/TerminalProvider";

export class JestTestRunner implements ITestRunnerInterface {
  public name: string = "jest";
  public terminalProvider: TerminalProvider = null;
  public configurationProvider: ConfigurationProvider = null;

  get binPath(): string {
    return join("node_modules", ".bin", "jest");
  }

  constructor({ terminalProvider, configurationProvider }: ITestRunnerOptions) {
    this.terminalProvider = terminalProvider;
    this.configurationProvider = configurationProvider;
  }

  public runTest(testName: string, fileName: string) {
    const additionalArguments = this.configurationProvider.additionalArguments;
    // We force slash instead of backslash for Windows
    const cleanedFileName = fileName.replace(/\\/g, "/");

    const command = `${
      this.binPath
    } ${cleanedFileName} --testNamePattern="${testName}" ${additionalArguments}`;

    const terminal = this.terminalProvider.get();

    terminal.sendText(command, true);
    terminal.show(true);
  }

  public debugTest(testName: string, fileName: string) {
    const additionalArguments = this.configurationProvider.additionalArguments;
    const environmentVariables = this.configurationProvider
      .environmentVariables;
    // We force slash instead of backslash for Windows
    const cleanedFileName = fileName.replace(/\\/g, "/");

    debug.startDebugging(null, {
      args: [
        cleanedFileName,
        `--testNamePattern`,
        testName,
        "--runInBand",
        ...additionalArguments.split(" ")
      ],
      console: "integratedTerminal",
      env: environmentVariables,
      name: "Debug Test",
      program: "${workspaceFolder}/node_modules/.bin/jest",
      request: "launch",
      type: "node",
      windows: {
        program: "${workspaceFolder}/node_modules/jest/bin/jest"
      }
    });
  }
}
