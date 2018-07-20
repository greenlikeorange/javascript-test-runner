import { relative } from "path";
import { workspace, WorkspaceFolder } from "vscode";

import { getTestRunner } from "../runners/TestRunnerFactory";

async function debugTest(
  rootPath: WorkspaceFolder,
  fileName: string,
  testName: string
) {
  const relativeFilename = relative(String(rootPath), fileName);
  const testRunner = await getTestRunner(rootPath);

  testRunner.debugTest(
    workspace.workspaceFolders[0],
    relativeFilename,
    testName
  );
}

export default debugTest;
