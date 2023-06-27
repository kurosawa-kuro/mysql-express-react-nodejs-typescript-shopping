import { render } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { App } from "../../App";
import { createServer, simulateLogin } from "../test-utils";
import { HomeScreen } from "../../screens/product/HomeScreen";

const server = createServer();

describe("Product Operation", () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  describe("User", () => {
    it("should display user info after login", async () => {
      render(
        <MemoryRouter initialEntries={["/"]}>
          <Routes>
            <Route path="/" element={<App />}>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/search/:keyword" element={<HomeScreen />} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      await simulateLogin();
    });
  });
});
