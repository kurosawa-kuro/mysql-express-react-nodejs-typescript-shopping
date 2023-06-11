// src/screens/InformationScreen.test.tsx

import { render, screen, waitFor } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { InformationGetScreen } from "./InformationGetScreen";

const handlers = [
  rest.get("https://jsonplaceholder.typicode.com/users", (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        { id: 1, name: "John" },
        { id: 2, name: "Doe" },
        // Add more mock data if necessary
      ])
    );
  }),
];

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("fetches and displays users", async () => {
  render(<InformationGetScreen />);
  expect(await screen.findByText("ユーザ一覧")).toBeInTheDocument();

  await waitFor(async () => {
    expect(await screen.findByText("1.John")).toBeInTheDocument();
    expect(await screen.findByText("2.Doe")).toBeInTheDocument();
  });
});
