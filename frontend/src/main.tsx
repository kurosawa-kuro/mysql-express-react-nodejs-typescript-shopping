// frontend\src\main.tsx

// External Imports
import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

// Internal Imports
import { App } from "./App.tsx";
import "./index.css";
import { LoginScreen } from "./screens/auth/LoginScreen.tsx";
import { RegisterScreen } from "./screens/auth/RegisterScreen.tsx";
import { CartScreen } from "./screens/order/CartScreen.tsx";
import { ShippingScreen } from "./screens/order/ShippingScreen.tsx";
import { PaymentScreen } from "./screens/order/PaymentScreen.tsx";
import { PlaceOrderScreen } from "./screens/order/PlaceOrderScreen.tsx";
import { OrderScreen } from "./screens/order/OrderScreen.tsx";
import { HomeScreen } from "./screens/product/HomeScreen";
import { ProductScreen } from "./screens/product/ProductScreen";
import { ProfileScreen } from "./screens/user/ProfileScreen";
import { UserListScreen } from "./screens/admin/user/UserListScreen";
import { UserEditScreen } from "./screens/admin/user/UserEditScreen";
import { ProductListScreen } from "./screens/admin/product/ProductListScreen";
import { ProductNewScreen } from "./screens/admin/product/ProductNewScreen";
import { ProductEditScreen } from "./screens/admin/product/ProductEditScreen";
import { OrderListScreen } from "./screens/admin/order/OrderListScreen";
import { PrivateRoute } from "./components/routing/PrivateRoute";
import { AdminRoute } from "./components/routing/AdminRoute";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<HomeScreen />} />
      <Route path="/search/:keyword" element={<HomeScreen />} />
      <Route path="/page/:pageNumber" element={<HomeScreen />} />
      <Route
        path="/search/:keyword/page/:pageNumber"
        element={<HomeScreen />}
      />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="/login" element={<LoginScreen />} />

      <Route path="" element={<PrivateRoute />}>
        <Route path="/cart" element={<CartScreen />} />
        <Route path="/orders/:id" element={<OrderScreen />} />
        <Route path="/orders/" element={<OrderListScreen />} />
        <Route path="/payment" element={<PaymentScreen />} />
        <Route path="/place-order" element={<PlaceOrderScreen />} />
        <Route path="/products/:id" element={<ProductScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/shipping" element={<ShippingScreen />} />
      </Route>

      <Route path="" element={<AdminRoute />}>
        <Route path="/admin/orders/" element={<OrderListScreen />} />
        <Route path="/admin/products/" element={<ProductListScreen />} />
        <Route
          path="/admin/products/:pageNumber"
          element={<ProductListScreen />}
        />
        <Route path="/admin/products/new" element={<ProductNewScreen />} />
        <Route
          path="/admin/products/:id/edit"
          element={<ProductEditScreen />}
        />
        <Route path="/admin/users" element={<UserListScreen />} />
        <Route path="/admin/users/:id/edit" element={<UserEditScreen />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
