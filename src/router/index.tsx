import { Component, lazy, ParentComponent } from "solid-js";
import { Route } from "@solidjs/router";
// router/layouts
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
// screens
import HomeScreen from "../screens/Home";
// (lazy) screens
const LoginScreen = lazy(() => import("../screens/Login"));
const RegisterScreen = lazy(() => import("../screens/Register"));

const AppRoutes = () => {
  return (
    <>
      <Route
        path="/"
        component={MainLayout}
      >
        <Route
          path="/"
          component={HomeScreen}
        />
      </Route>
      <Route
        path="/auth"
        component={AuthLayout}
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
