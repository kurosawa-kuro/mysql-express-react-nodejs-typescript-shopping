// frontend\src\screens\admin\product\ProductNewScreenLoggedIn.test.tsx

import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { App } from "../../../App";
import { LoginScreen } from "../../../screens/auth/LoginScreen";
import { createServer, inputField, TEST_ADMIN_USER } from "../../test-utils";

const server = createServer();

const LABELS = {
  email: "email",
  password: "password",
  name: "Name",
  price: "Price",
  imageFile: "Image File",
  brand: "Brand",
  countInStock: "Count In Stock",
  category: "Category",
  description: "Description",
};

describe("Admin Product Management", () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterEach(() => {
    server.resetHandlers();
    server.close();
  });

  describe("Login process", () => {
    it("renders login and admin can login", async () => {
      render(
        <MemoryRouter initialEntries={["/login"]}>
          <Routes>
            <Route path="/" element={<App />}>
              <Route path="/login" element={<LoginScreen />} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      inputField(LABELS.email, TEST_ADMIN_USER.email);
      inputField(LABELS.password, TEST_ADMIN_USER.password);

      fireEvent.click(screen.getByTestId("login"));

      await screen.findByText("admin", {
        selector: '[data-testid="user-info-name"]',
      });
    });
  });
});
