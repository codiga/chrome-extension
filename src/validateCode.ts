import { v4 as uuidv4 } from "uuid";
import { createClient } from "@urql/core";
import { groupBy, timeout } from "./utils";
import  {ValidateCodeResult, ValidateCodeInformation, Violation} from './types';
import { createFileAnalysisMutation, getFileAnalysisQuery } from "./graphQLQueries";

const client = createClient({
  url: "https://www.code-inspector.com/graphql",
  requestPolicy: 'cache-and-network'
});

const runningValidationsCache: Record<string, string> = {};
const STORAGE_FINGERPRINT_KEY = "codiga-user";

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


export const validateCode = async (request: ValidateCodeInformation): Promise<ValidateCodeResult> => {
  
  const executionId = uuidv4();
  const fingerprint = await generateFingerprint();
  const code = request.code;
  const language = request.language;
  const filename = request.filename;

  const codeElementId = request.id;
  runningValidationsCache[codeElementId] = executionId;

  const shouldFetch = await getShouldFetch(executionId, codeElementId);
  const createAnalysisResult = shouldFetch
      ? await client
          .mutation(
            createFileAnalysisMutation(code, fingerprint, language, filename)
          )
          .toPromise()
      : undefined;
  
  if (createAnalysisResult) {
    return new Promise((resolve, reject) => {
      
      const errors = createAnalysisResult.data.errors;
      if (errors && errors.length) {
        resolve({ violations: [], errors });
      }
  
      const analysisId = createAnalysisResult.data.createFileAnalysis;
      let iterations = 0;
      const max_poll_iterations = 10;

      const validateCodeInterval = setInterval(async () => {
        if(executionId !== runningValidationsCache[codeElementId]){
          clearInterval(validateCodeInterval);
          reject(executionId);
        }

        const getAnalysisResult = await client
          .query(getFileAnalysisQuery(fingerprint, analysisId))
          .toPromise();

        const errors = getAnalysisResult.data.errors;
        if (errors && errors.length) {
          clearInterval(validateCodeInterval);
          resolve({ violations: [], errors });
        }

        if (getAnalysisResult.data?.getFileAnalysis?.status === "Done") {
          clearInterval(validateCodeInterval);

          const groupedViolations = groupBy(
            getAnalysisResult.data.getFileAnalysis.violations,
            "line"
          );

          const mappedViolations = Object.keys(groupedViolations).map((key) => {
            return <Violation>{
              line: Number(key),
              group: groupedViolations[key],
            };
          });

          resolve({ errors: <any>[], violations: mappedViolations });
        }

        if(iterations >= max_poll_iterations){
          clearInterval(validateCodeInterval);
          resolve({ errors: <any>[], violations: <Violation[]>[]});
        }

        iterations += 1;
      }, 2000);
    });
  } else {}
}