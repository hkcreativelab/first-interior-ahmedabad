import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createHashHistory } from "@tanstack/react-router";
import { getRouter } from "./router";
import "./styles.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

const router = getRouter(createHashHistory());

createRoot(rootElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
