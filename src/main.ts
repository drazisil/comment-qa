import * as dotenvSafe from "dotenv-safe";
import * as inquirer from "inquirer";

dotenvSafe.config();

export function generateSearchQuery(
  zendeskUrl: any,
  zendeskAgentEmail: any,
  fromDate: string,
) {
  return `${zendeskUrl}/api/v2/search.json?query=commenter:${zendeskAgentEmail}%20updated>${fromDate}`;
}

export function randMax(max: number) {
  return Math.round(Math.random() * max);
}

export function getTicketCount(res: any) {
  return res.length;
}

export function getRandomTicketID(res: any): number {
  return res[randMax(getTicketCount(res) - 1)].id;
}

export function appendResults(originalResults: any, resultsToAdd: any[]) {
  if (resultsToAdd.length < 1) {
    return originalResults;
  }
  const newResults = originalResults.concat(resultsToAdd);
  return newResults;
}

export interface IAnswers {
  daysAgo: number;
}
