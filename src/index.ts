import * as inquirer from "inquirer";
import * as app from "./main";
const prompt = inquirer.createPromptModule();

prompt([
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
]).then((answers: any) => {
  const daysAgo = answers.daysAgo;
  const {
    ZENDESK_EMAIL,
    ZENDESK_API_TOKEN,
    ZENDESK_URL,
    ZENDESK_AGENT_EMAIL,
  } = process.env;
  const fetchURL = app.generateSearchQuery(
    ZENDESK_URL,
    ZENDESK_AGENT_EMAIL!,
    daysAgo,
  );
  console.log(`Fetching tickets from ${daysAgo} days ago...`);
  app
    .fetchTickets([], fetchURL, ZENDESK_EMAIL, ZENDESK_API_TOKEN)
    .then((tickets: any[]) => {
      console.log(`Located ${app.getTicketCount(tickets)} tickets.`);
      console.log(
        `Random ticket: ${ZENDESK_URL}/agent/tickets/${app.getRandomTicketID(
          tickets,
        )}`,
      );
    });
});
