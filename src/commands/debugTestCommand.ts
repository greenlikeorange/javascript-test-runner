import { relative } from "path";

import { getTestRunner } from "../runners/TestRunnerFactory";

async function debugTest(rootPath, fileName, testName) {
  const stringifiedRootPath = String(rootPath);
  const relativeFilename = relative(stringifiedRootPath, fileName);
  const testRunner = await getTestRunner(stringifiedRootPath);

  testRunner.debugTest(testName, relativeFilename);
}

export default debugTest;
