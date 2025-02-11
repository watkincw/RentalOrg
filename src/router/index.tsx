import { Component, lazy, ParentComponent } from "solid-js";
import { Route } from "@solidjs/router";
// // context
// import AuthProvider from "../context/auth";
// screens
import HomeScreen from "../screens/Home";
// (lazy) screens
const LoginScreen = lazy(() => import("../screens/Login"));
const RegisterScreen = lazy(() => import("../screens/Register"));

// const ScreenExt: ParentComponent = (props) => {
//   return <AuthProvider>{props.children}</AuthProvider>;
// };

// const withScreenExt = (Component: Component) => {
//   return (props: any) => (
//     <ScreenExt>
//       <Component {...props} />
//     </ScreenExt>
//   );
// };

const AppRoutes = () => {
  return (
    <>
      <Route
        path="/"
        component={HomeScreen}
        // component={withScreenExt(HomeScreen)}
      />
      <Route
        path="/login"
        component={LoginScreen}
        // component={withScreenExt(LoginScreen)}
      />
      <Route
        path="/register"
        component={RegisterScreen}
        // component={withScreenExt(RegisterScreen)}
      />
    </>
  );
};

export default AppRoutes;
