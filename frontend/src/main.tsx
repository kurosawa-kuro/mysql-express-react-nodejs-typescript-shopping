// src\main.tsx

import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { HomeScreen } from "./screens/product/HomeScreen";
import { ProductScreen } from "./screens/product/ProductScreen";
import { CartScreen } from "./screens/order/CartScreen.tsx";
import { ShippingScreen } from "./screens/order/ShippingScreen.tsx";
import { PaymentScreen } from "./screens/order/PaymentScreen.tsx";
import { PlaceOrderScreen } from "./screens/order/PlaceOrderScreen.tsx";
import { InformationGetScreen } from "./screens/InformationGetScreen.tsx";
import { InformationPostScreen } from "./screens/InformationPostScreen.tsx";
import LoginScreen from "./screens/auth/LoginScreen.tsx";
import RegisterScreen from "./screens/auth/RegisterScreen.tsx";
import { OrderScreen } from "./screens/order/OrderScreen.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<HomeScreen />} />
      <Route path="/product/:id" element={<ProductScreen />} />
      <Route path="/cart" element={<CartScreen />} />
      <Route path="information-get" element={<InformationGetScreen />} />
      <Route path="information-post" element={<InformationPostScreen />} />
      <Route path="login" element={<LoginScreen />} />
      <Route path="register" element={<RegisterScreen />} />

      <Route path="/shipping" element={<ShippingScreen />} />
      <Route path="/payment" element={<PaymentScreen />} />
      <Route path="/place-order" element={<PlaceOrderScreen />} />
      <Route path="/order/:id" element={<OrderScreen />} />
      {/* <Route path="information-post" element={<InformationPostScreen />} /> */}
      {/* Registered users */}
      {/* <Route path="" element={<PrivateRoute />}>
        <Route path="/shipping" element={<ShippingScreen />} />
      </Route> */}
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
