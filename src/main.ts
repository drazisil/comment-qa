require("dotenv-safe").config();
import * as inquirer from "inquirer";
import * as request from "request";
const prompt = inquirer.createPromptModule();

const {
  ZENDESK_EMAIL,
  ZENDESK_API_TOKEN,
  ZENDESK_URL,
  ZENDESK_AGENT_EMAIL,
} = process.env;

const query = `${ZENDESK_URL}search.json?query=commenter:${ZENDESK_AGENT_EMAIL}%20updated>30days`;

export function generateSearchQuery(
  zendeskUrl: string,
  zendeskAgentEmail: string,
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
): Promise<any[]> {
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

export function getTicketCount(res: any) {
  return res.length;
}

export function getRandomTicketID(res: any): number {
  return res[randMax(getTicketCount(res)) - 1].id;
}

export function appendResults(originalResults: any, resultsToAdd: any[]) {
  if (resultsToAdd.length < 1) {
    return originalResults;
  }
  const newResults = originalResults.concat(resultsToAdd);
  return newResults;
}

interface IAanswers {
  daysAgo: number;
}

export async function run() {
  const answers: IAanswers = await prompt([
    {
      default: 30,
      message: "Query tickets how many days back?",
      name: "daysAgo",
      type: "input",
      validate(value) {
        const pass = !isNaN(parseInt(value, 10));
        if (pass) {
          return true;
        }

        return "Please enter a valid number";
      },
    },
  ]);
  const { daysAgo } = answers;
  const fetchURL = generateSearchQuery(
    ZENDESK_URL!,
    ZENDESK_AGENT_EMAIL!,
    daysAgo,
  );
  let tickets: any[] = [];
  console.log(`Fetching tickets from ${daysAgo} days ago...`);
  tickets = await fetchTickets(tickets, fetchURL);
  console.log(`Located ${getTicketCount(tickets)} tickets.`);
  console.log(
    `Random ticket: ${ZENDESK_URL}/agent/tickets/${getRandomTicketID(tickets)}`,
  );
}
