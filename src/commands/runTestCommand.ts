import { relative } from "path";

import { getTestRunner } from "../runners/TestRunnerFactory";

async function runTest(rootPath, fileName, testName) {
  const stringifiedRootPath = String(rootPath);
  const relativeFilename = relative(stringifiedRootPath, fileName);
  const testRunner = await getTestRunner(stringifiedRootPath);

  testRunner.runTest(testName, relativeFilename);
}

export default runTest;
