import { join } from "path";
import { debug } from "vscode";

import { ITestRunnerInterface } from "../interfaces/ITestRunnerInterface";
import { ITestRunnerOptions } from "../interfaces/ITestRunnerOptions";
import { ConfigurationProvider } from "../providers/ConfigurationProvider";
import { TerminalProvider } from "../providers/TerminalProvider";

export class MochaTestRunner implements ITestRunnerInterface {
  public name: string = "mocha";
  public terminalProvider: TerminalProvider = null;
  public configurationProvider: ConfigurationProvider = null;

  get binPath(): string {
    return join("node_modules", ".bin", "mocha");
  }

  constructor({ terminalProvider, configurationProvider }: ITestRunnerOptions) {
    this.terminalProvider = terminalProvider;
    this.configurationProvider = configurationProvider;
  }

  public runTest(testName: string, fileName: string) {
    const additionalArguments = this.configurationProvider.additionalArguments;

    const command = `${
      this.binPath
    } ${fileName} --grep="${testName}" ${additionalArguments}`;

    const terminal = this.terminalProvider.get();

    terminal.sendText(command, true);
    terminal.show(true);
  }

  public debugTest(testName: string, fileName: string) {
    const additionalArguments = this.configurationProvider.additionalArguments;
    const environmentVariables = this.configurationProvider
      .environmentVariables;

    debug.startDebugging(null, {
      args: [
        fileName,
        `--grep "${testName}"`,
        "--no-timeout",
        ...additionalArguments.split(" ")
      ],
      console: "integratedTerminal",
      env: environmentVariables,
      name: "Debug Test",
      program: this.binPath,
      request: "launch",
      type: "node",
      windows: {
        program: "${workspaceFolder}/node_modules/mocha/bin/_mocha"
      }
    });
  }
}
