import { Route } from "@solidjs/router";
import { Component, lazy, ParentComponent } from "solid-js";
import App from "../App";
// router/layouts
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
// context
import AuthProvider from "../context/auth";
import UIProvider from "../context/ui";
// screens
import HomePage from "../pages/Home";
import ProfilePage from "../pages/Profile";
// (lazy) screens
const LoginScreen = lazy(() => import("../pages/Login"));
const RegisterScreen = lazy(() => import("../pages/Register"));

const ScreenExt: ParentComponent = (props) => {
  return (
    <>
      <UIProvider>
        <AuthProvider>{props.children}</AuthProvider>
      </UIProvider>
    </>
  );
};

const withScreenExt = (Component: Component) => {
  return (props: any) => (
    <ScreenExt>
      <App>
        <Component {...props} />
      </App>
    </ScreenExt>
  );
};

const AppRoutes = () => {
  return (
    <>
      <Route
        path="/"
        component={withScreenExt(MainLayout)}
      >
        <Route
          path="/"
          component={HomePage}
        />
        <Route
          path="/profile"
          component={ProfilePage}
        />
      </Route>
      <Route
        path="/auth"
        component={withScreenExt(AuthLayout)}
      >
        <Route
          path="/login"
          component={LoginScreen}
        />
        <Route
          path="/register"
          component={RegisterScreen}
        />
      </Route>
    </>
  );
};

export default AppRoutes;
