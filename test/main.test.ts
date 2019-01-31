import * as testApp from "../src/main";
jest.mock("request");

test("appendResults adds to the array", () => {
  expect(testApp.appendResults([1, 2], [3, 4])).toEqual([1, 2, 3, 4]);
});

test("appendResults return the array when not passed anything to add", () => {
  expect(testApp.appendResults([1, 2], [])).toEqual([1, 2]);
});

test("fetchTickets returns array with only one page", async () => {
  expect.assertions(1);
  await expect(testApp.fetchTickets([], "foo", "bar", "baz")).resolves.toEqual([
    { id: 1 },
  ]);
});

test("fetchTickets returns array with more then one page", async () => {
  expect.assertions(1);
  await expect(testApp.fetchTickets([], "moo", "foo", "pan")).resolves.toEqual([
    { id: 1 },
    { id: 1 },
  ]);
});

test("getTicketCount can get length", () => {
  expect(testApp.getTicketCount([1, 2, 3, 4])).toEqual(4);
});

test("getRandomTicketID gets a random id", () => {
  const tickets = testApp.getRandomTicketID([{ id: 1 }, { id: 2 }, { id: 3 }]);
  expect(tickets).toBeGreaterThan(0);
  expect(tickets).toBeLessThan(4);
});

test("randMax returns a random number", () => {
  const tickets = testApp.randMax(4);

  expect(tickets).toBeGreaterThan(-1);
  expect(tickets).toBeLessThan(5);
});

test("generateSearchQuery can generate query", () => {
  expect(testApp.generateSearchQuery("moo", "a@b.com", 5)).toEqual(
    "moo/api/v2/search.json?query=commenter:a@b.com%20updated>5days",
  );
});
