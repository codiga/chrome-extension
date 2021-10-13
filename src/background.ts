import { v4 as uuidv4 } from "uuid";
import { gql, createClient } from "@urql/core";
import { DocumentNode, graphql } from "graphql";

const client = createClient({
  url: "https://www.code-inspector.com/graphql",
});

const runningValidationsCache: Record<string, string> = {};

const STORAGE_FINGERPRINT_KEY = "codiga-user";

chrome.storage.onChanged.addListener(function (changes, namespace) {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    console.log(
      `Storage key "${key}" in namespace "${namespace}" changed.`,
      `Old value was "${oldValue}", new value is "${newValue}".`
    );
  }
});

const generateFingerprint = (): Promise<string> => {
  return new Promise((resolve) => {
    chrome.storage.sync.get([STORAGE_FINGERPRINT_KEY], (result) => {
      if (
        result &&
        Object.keys(result).length === 0 &&
        result.constructor === Object
      ) {
        const fingerprint = uuidv4();
        chrome.storage.sync.set(
          { [STORAGE_FINGERPRINT_KEY]: fingerprint },
          () => {
            resolve(fingerprint);
          }
        );
      } else {
        resolve(result[STORAGE_FINGERPRINT_KEY]);
      }
    });
  });
};

const createFileAnalysisMutation = (
  code: string,
  fingerprint: string,
  language: string,
  filename: string
): DocumentNode =>
  gql`mutation {
    createFileAnalysis(language: ${language}, filename: "${filename}", code: ${JSON.stringify(
    code
  )}, fingerprint: "${fingerprint}")
}`;

const getFileAnalysisQuery = (fingerprint: string, analysisId: string) =>
  gql`{
    getFileAnalysis(id: ${analysisId}, fingerprint: "${fingerprint}"){
        violations {
            line
            description
            tool
            category
            rule
            severity
        }
        code
        status
        timestamp
        runningTimeSeconds
    }
}`;

class FetchChecker {
  innerAnalysisId: string;

  constructor(innerAnalysisId: string) {
    this.innerAnalysisId = innerAnalysisId;
  }

  shouldFetch(cacheKey: string) {
    return this.innerAnalysisId === runningValidationsCache[cacheKey];
  }
}

const getShouldFetch = async (excecutionId: string, cacheKey: string) => {
  const fetchChecker = new FetchChecker(excecutionId);

  await new Promise((resolve) => {
    const timeout = setTimeout(() => {
      clearTimeout(timeout);
      resolve(false);
    }, 1000);
  });

  return fetchChecker.shouldFetch(cacheKey);
};

const groupBy = (l: Array<any>, key: string) => {
  return l.reduce((acc, curr) => {
    (acc[curr[key]] = acc[curr[key]] || []).push(curr);
    return acc;
  }, {});
};

type ValidateCodeRequest = {
  data: { code: string; language: string; filename: string; id: string };
};

const validateCode = (request: ValidateCodeRequest) =>
  new Promise(async (resolve) => {
    const fingerprint = await generateFingerprint();
    const code = request.data.code;
    const language = request.data.language;
    const filename = request.data.filename;

    const codeElementId = request.data.id;
    const executionId = uuidv4();

    runningValidationsCache[codeElementId] = executionId;

    const shouldFetch = await getShouldFetch(executionId, codeElementId);

    const createAnalysisResult = shouldFetch
      ? await client
          .mutation(
            createFileAnalysisMutation(code, fingerprint, language, filename)
          )
          .toPromise()
      : undefined;

    const errors = createAnalysisResult?.data.errors;
    if (errors && errors.length) {
      resolve({ errors });
      return;
    }

    // It won't run unless it's the latest typed code
    if (createAnalysisResult) {
      const analysisId = createAnalysisResult.data.createFileAnalysis;

      const interval = setInterval(async () => {
        const getAnalysisResult = await client
          .query(getFileAnalysisQuery(fingerprint, analysisId))
          .toPromise();

        const errors = getAnalysisResult.data.errors;
        if (errors) {
          resolve({ errors });
        }

        if (getAnalysisResult.data?.getFileAnalysis?.status === "Done") {
          clearInterval(interval);
          const groupedViolations = groupBy(
            getAnalysisResult.data.getFileAnalysis.violations,
            "line"
          );
          const mappedViolations = Object.keys(groupedViolations).map((key) => {
            return {
              line: key,
              group: groupedViolations[key],
            };
          });
          resolve({ violations: mappedViolations });
        }

        resolve({violations: []})
      }, 2000);
    }
  });

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.contentScriptQuery == "validateCode") {
    validateCode(request).then((result) => {
      sendResponse(result);
    });
  }

  if (request.contentScriptQuery == "validateGitHubToken") {
    validateCode(request).then((result) => {
      sendResponse(result);
    });
  }

  return true;
});

// To load content-script again when url changes
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.url || changeInfo.status === "complete") {
    chrome.tabs.sendMessage(
      tabId,
      { action: "updateContainer" },
      function (response) {}
    );
  }
});
