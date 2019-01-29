require("dotenv-safe").config();
import * as request from "request";

const {
  ZENDESK_EMAIL,
  ZENDESK_API_TOKEN,
  ZENDESK_URL,
  ZENDESK_AGENT_EMAIL,
} = process.env;

const query = `${ZENDESK_URL}search.json?query=commenter:${ZENDESK_AGENT_EMAIL}%20updated>30days`;

function generateSearchQuery(
  zendeskUrl: string,
  zendeskAgentEmail: string,
  daysAgo: number,
) {
  return `${zendeskUrl}search.json?query=commenter:${zendeskAgentEmail}%20updated>${daysAgo}days`;
}

function fetchPage(url: string) {}

async function fetchTickets(tickets: any[], url: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    request.get(
      url,
      {
        auth: {
          pass: ZENDESK_API_TOKEN,
          sendImmediately: false,
          user: `${ZENDESK_EMAIL}/token`,
        },
      },
      async (error, response, body) => {
        const info = JSON.parse(body);
        tickets = tickets.concat(info.results);
        if (info.next_page) {
          resolve(await fetchTickets(tickets, info.next_page));
        }
        resolve(tickets);
      },
    );
  });
}

function getTicketCount(res: any) {
  console.log("l: ", res.length);
}

function appendResults(originalResults: any, resultsToAdd: any) {
  if (resultsToAdd.length < 1) {
    return originalResults;
  }
  const newResults = originalResults;
  newResults.push(resultsToAdd);
  return newResults;
}

async function run() {
  const fetchURL = generateSearchQuery(ZENDESK_URL!, ZENDESK_AGENT_EMAIL!, 30);
  let tickets: any[] = [];
  tickets = await fetchTickets(tickets, fetchURL);
  console.log("moo");
  getTicketCount(tickets);
}

run();
