import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { App } from "../../App";
import { LoginScreen } from "../../screens/auth/LoginScreen";

const server = setupServer(
  rest.post("http://localhost:8080/api/users/login", async (req, res, ctx) => {
    const requestBody = JSON.parse(await req.text()) as any;
    if (
      requestBody.email === "john@email.com" &&
      requestBody.password === "123456"
    ) {
      return res(ctx.json({ id: 1, name: "john", email: "john@email.com" }));
    } else {
      return res(
        ctx.status(401),
        ctx.json({ message: "Invalid email or password" })
      );
    }
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("shows username in header after successful login", async () => {
  render(
    <MemoryRouter initialEntries={["/login"]}>
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/" element={<App />} />
      </Routes>
    </MemoryRouter>
  );

  fireEvent.change(screen.getByLabelText("email"), {
    target: { value: "john@email.com" },
  });

  fireEvent.change(screen.getByLabelText("password"), {
    target: { value: "123456" },
  });

  fireEvent.click(screen.getByTestId("login"));

  await waitFor(async () => {
    // Check that username is displayed in the header
    expect(screen.getByTestId("user-info-name")).toHaveTextContent("john");
  });
});
