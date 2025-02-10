import { render } from "solid-js/web";
import { Router } from "@solidjs/router";
import AppRoutes from "./router";
import App from "./App";

import "./index.css";

render(
  () =>
    <Router root={App}>
      <AppRoutes />
    </Router>,
    document.getElementById("root")!
);
