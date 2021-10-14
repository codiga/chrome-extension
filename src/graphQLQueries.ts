import { gql } from "@urql/core";
import { DocumentNode } from "graphql";

export const createFileAnalysisMutation = (
    code: string,
    fingerprint: string,
    language: string,
    filename: string
): DocumentNode =>
    gql`mutation {
    createFileAnalysis(language: ${language}, filename: "${filename}", code: ${JSON.stringify(
    code
    )}, fingerprint: "${fingerprint}")
    recordAccess(accessType: Chrome, actionType: FileAnalysisRequest)
}`;
  
export const getFileAnalysisQuery = (fingerprint: string, analysisId: string) =>
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