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
import HomeScreen from "../screens/Home";
import ProfileScreen from "../screens/Profile";
// (lazy) screens
const LoginScreen = lazy(() => import("../screens/Login"));
const RegisterScreen = lazy(() => import("../screens/Register"));

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
        component={withScreenExt(MainLayout)}>
        <Route
          path="/"
          component={HomeScreen}
        />
        <Route
          path="/profile"
          component={ProfileScreen}
        />
      </Route>
      <Route
        path="/auth"
        component={withScreenExt(AuthLayout)}>
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
