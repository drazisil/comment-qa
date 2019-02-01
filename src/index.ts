import * as inquirer from "inquirer";
import moment from "moment";
import { Cache } from "./cache";
import * as app from "./main";
const appCache = new Cache();

export async function cliGetFromDate() {
  const prompt = inquirer.createPromptModule();
  return prompt([
    {
      default: moment()
        .subtract(10, "days")
        .format("YYYY-MM-DD"),
      message: "Search tickets from what date?",
      name: "fromDate",
      type: "input",
      validate(value) {
        const pass = value.match(/([0-9]+)-([0-9]+)-([0-9]+)/);
        if (pass) {
          return true;
        }

        return "Please enter a valid date in the form YYYY-MM-DD";
      },
    },
  ]);
}

cliGetFromDate().then((answers: any) => {
  const fromDate = answers.fromDate;
  const {
    ZENDESK_EMAIL,
    ZENDESK_API_TOKEN,
    ZENDESK_URL,
    ZENDESK_AGENT_EMAIL,
  } = process.env;
  const fetchURL = app.generateSearchQuery(
    ZENDESK_URL,
    ZENDESK_AGENT_EMAIL!,
    fromDate,
  );
  console.log(`Fetching tickets from ${fromDate}...`);
  appCache
    .fetchTickets([], fetchURL, ZENDESK_EMAIL, ZENDESK_API_TOKEN)
    .then((tickets: any[]) => {
      console.log(`Located ${app.getTicketCount(tickets)} tickets.`);
      console.log(
        `Random ticket: ${ZENDESK_URL}/agent/tickets/${app.getRandomTicketID(
          tickets,
        )}`,
      );
    })
    .catch((err) => {
      throw err;
    });
});
