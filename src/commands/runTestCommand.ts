import { relative } from "path";
import { WorkspaceFolder } from "vscode";

import { getTestRunner } from "../runners/TestRunnerFactory";

async function runTest(
  rootPath: WorkspaceFolder,
  fileName: string,
  testName: string
) {
  const relativeFilename = relative(String(rootPath), fileName);
  const testRunner = await getTestRunner(rootPath);

  testRunner.runTest(rootPath, relativeFilename, testName);
}

export default runTest;
