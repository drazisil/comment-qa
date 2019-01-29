import {
  appendResults,
  fetchTickets,
  generateSearchQuery,
  getRandomTicketID,
  getTicketCount,
  randMax,
} from "../src/main";
jest.mock("request");

test("appendResults adds to the array", () => {
  expect(appendResults([1, 2], [3, 4])).toEqual([1, 2, 3, 4]);
});

test("appendResults return the array when not passed anything to add", () => {
  expect(appendResults([1, 2], [])).toEqual([1, 2]);
});

test("fetchTickets returns array with only one page", async () => {
  expect.assertions(1);
  await expect(fetchTickets([], "foo")).resolves.toEqual([{ id: 1 }]);
});

test("fetchTickets returns array with more then one page", async () => {
  expect.assertions(1);
  await expect(fetchTickets([], "moo")).resolves.toEqual([
    { id: 1 },
    { id: 1 },
  ]);
});

test("getTicketCount can get length", () => {
  expect(getTicketCount([1, 2, 3, 4])).toEqual(4);
});

test("getRandomTicketID gets a random id", () => {
  const tickets = getRandomTicketID([{ id: 1 }, { id: 2 }, { id: 3 }]);
  expect(tickets).toBeGreaterThan(0);
  expect(tickets).toBeLessThan(4);
});

test("randMax returns a random number", () => {
  const tickets = randMax(4);
  expect(tickets).toBeGreaterThan(0);
  expect(tickets).toBeLessThan(4);
});

test("generateSearchQuery can generate query", () => {
  expect(generateSearchQuery("moo", "a@b.com", 5)).toEqual(
    "moo/api/v2/search.json?query=commenter:a@b.com%20updated>5days",
  );
});
