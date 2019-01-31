require("dotenv-safe").config();
import * as request from "request";

export function generateSearchQuery(
  zendeskUrl: any,
  zendeskAgentEmail: any,
  daysAgo: number,
) {
  return `${zendeskUrl}/api/v2/search.json?query=commenter:${zendeskAgentEmail}%20updated>${daysAgo}days`;
}

export function randMax(max: number) {
  return Math.round(Math.random() * max);
}
export async function fetchTickets(
  tickets: any[],
  url: string,
  zendeskEmail: any,
  zendeskApiToken: any,
): Promise<any[]> {
  return new Promise((resolve, reject) => {
    request.get(
      url,
      {
        auth: {
          pass: zendeskApiToken,
          sendImmediately: false,
          user: `${zendeskEmail}/token`,
        },
      },
      async (error, response, body) => {
        const info = JSON.parse(body);
        tickets = tickets.concat(info.results);
        if (info.next_page) {
          resolve(
            await fetchTickets(
              tickets,
              info.next_page,
              zendeskEmail,
              zendeskApiToken,
            ),
          );
        }
        resolve(tickets);
      },
    );
  });
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
