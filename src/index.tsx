import { render } from "solid-js/web";
import { Router } from "@solidjs/router";
// import App from "./App";
import "./index.css";
// router
import AppRoutes from "./router";

render(
  () => (
    <Router>
      <AppRoutes />
    </Router>
  ),
  document.getElementById("root")!
);
