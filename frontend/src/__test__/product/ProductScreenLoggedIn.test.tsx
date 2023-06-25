import { render, screen, renderHook } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { App } from "../../App";
import { LoginScreen } from "../../screens/auth/LoginScreen";
import { createServer, printDOM } from "../test-utils";
import { HomeScreen } from "../../screens/product/HomeScreen";
import { useAuthStore } from "../../state/store";

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
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/" element={<HomeScreen />} />
              <Route path="/search/:keyword" element={<HomeScreen />} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      // 強制的にログインさせる
      const { result } = renderHook(() => useAuthStore());

      // Simulate login by setting user information
      act(() => {
        result.current.setUserInformation({
          id: 1,
          name: "Test User",
          email: "test@example.com",
          isAdmin: false,
          token: "testToken",
        });
      });

      // Verify user information display after successful login
      await screen.findByText("Test User", {
        selector: '[data-testid="user-info-name"]',
      });

      printDOM();
    });
  });
});
