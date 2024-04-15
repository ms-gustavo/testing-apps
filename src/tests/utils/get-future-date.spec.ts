import { expect, test } from "vitest";
import { getFutureDate } from "./get-future-date";

test("increses date with one year", () => {
  const year = new Date().getFullYear();
  const nextYear = new Date().getFullYear() + 1;
  expect(getFutureDate(`${year}-08-10`).getFullYear()).toEqual(nextYear);
});
