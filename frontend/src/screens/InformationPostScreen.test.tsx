// src/screens/InformationPostScreen.test.tsx

import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { InformationPostScreen } from "./InformationPostScreen";

let id = 1;
const handlers = [
  rest.post("https://jsonplaceholder.typicode.com/posts", (req, res, ctx) => {
    const newPost = { ...(req.body as any), id: id++ }; // increment id for each post
    return res(ctx.status(201), ctx.json(newPost));
  }),
];

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("creates and displays posts", async () => {
  render(<InformationPostScreen />);

  // Simulate user typing into input field and submitting form
  fireEvent.change(screen.getByLabelText(/Title/i), {
    target: { value: "Test title" },
  });
  fireEvent.change(screen.getByLabelText(/Body/i), {
    target: { value: "Test body" },
  });
  fireEvent.click(screen.getByText(/Submit/i));

  await waitFor(async () => {
    // After submitting the form, new post should be displayed in the list
    expect(await screen.findByText("Test title")).toBeInTheDocument();
    expect(screen.getByText("Test body")).toBeInTheDocument();
  });
});
