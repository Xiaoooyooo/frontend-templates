import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import "@/assets/style/tailwind.css";

const root = createRoot(document.getElementById("root")!);

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
