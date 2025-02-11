import { render } from "solid-js/web";
import { Router } from "@solidjs/router";
import App from "./App";
import "./index.css";
// router
import AppRoutes from "./router";
// context
import AuthProvider from "./context/auth";

render(
  () => (
    <AuthProvider>
      <Router root={App}>
        <AppRoutes />
      </Router>
    </AuthProvider>
  ),
  document.getElementById("root")!
);
