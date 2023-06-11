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
import { HomeScreen } from "./screens/HomeScreen";
import { InformationGetScreen } from "./screens/InformationGetScreen.tsx";
import { InformationPostScreen } from "./screens/InformationPostScreen.tsx";
import LoginScreen from "./screens/auth/LoginScreen.tsx";
import RegisterScreen from "./screens/auth/RegisterScreen.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<HomeScreen />} />
      <Route path="information-get" element={<InformationGetScreen />} />
      <Route path="information-post" element={<InformationPostScreen />} />
      <Route path="login" element={<LoginScreen />} />
      <Route path="register" element={<RegisterScreen />} />
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
