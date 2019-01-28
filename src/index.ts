var Zendesk = require('zendesk-node-api');
require('dotenv-safe').config();
 
var zendesk = new Zendesk({
  url: process.env.ZENDESK_URL, // https://example.zendesk.com
  email: process.env.YOUR_ZENDESK_EMAIL, // me@example.com
  token: process.env.ZENDESK_API_TOKEN // hfkUny3vgHCcV3UfuqMFZWDrLKms4z3W2f6ftjPT
});