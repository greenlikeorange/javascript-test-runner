import { Terminal, TerminalOptions, window } from "vscode";

let activeTerminal: Terminal = null;

export class TerminalProvider {
  private rootPath: string;
  private terminalOptions: TerminalOptions;

  constructor(terminalOptions: TerminalOptions, rootPath: string) {
    this.rootPath = rootPath;
    this.terminalOptions = terminalOptions;
  }

  public get(): Terminal {
    if (activeTerminal) {
      activeTerminal.dispose();
    }

    activeTerminal = window.createTerminal(this.terminalOptions);
    activeTerminal.sendText(`cd ${this.rootPath}`, true);

    return activeTerminal;
  }
}
