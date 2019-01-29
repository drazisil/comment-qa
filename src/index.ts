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
  return `${zendeskUrl}/api/v2/search.json?query=commenter:${zendeskAgentEmail}%20updated>${daysAgo}days`;
}

function randMax(max: number) {
  return Math.round(Math.random() * max);
}
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
  return res.length;
}

function getRandomTicketID(res: any) {
  return res[randMax(getTicketCount(res))].id;
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
  console.log(`Located ${getTicketCount(tickets)} tickets.`);
  console.log(
    `Random ticket: ${ZENDESK_URL}/agent/tickets/${getRandomTicketID(tickets)}`,
  );
}

run();
