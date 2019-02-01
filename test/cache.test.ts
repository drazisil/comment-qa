import { Cache } from "../src/cache";
const testCache = new Cache();
jest.mock("request");

describe("Caching functions", () => {
  test("fetchTickets returns array with only one page", async () => {
    expect.assertions(1);
    await expect(
      testCache.fetchTickets([], "goodUrl", "bar", "baz"),
    ).resolves.toEqual([{ id: 1 }]);
  });

  test("fetchTickets returns array with more then one page", async () => {
    expect.assertions(1);
    await expect(
      testCache.fetchTickets([], "goodUrlPage2", "foo", "pan"),
    ).resolves.toEqual([{ id: 1 }, { id: 1 }]);
  });

  test("fetchTickets returns error with invalid url", async () => {
    expect.assertions(1);
    await expect(
      testCache.fetchTickets([], "badUrl", "foo", "pan"),
    ).rejects.toEqual("fail");
  });

  test("fetchTickets returns error with invalid request", async () => {
    expect.assertions(1);
    await expect(
      testCache.fetchTickets([], "badRequest", "foo", "pan"),
    ).rejects.toEqual("invalid");
  });
});
