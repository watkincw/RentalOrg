import { Component, ParentProps } from "solid-js";
import { Analytics } from "@vercel/analytics/react"
// componenmts/snackbar
import SnackbarContainer from "./components/snackbar/Container";

const App: Component<ParentProps> = (props) => {
  return (
    <>
      <div id="popups" />
      <SnackbarContainer />
      {props.children}
      <Analytics />
    </>
  );
};

export default App;
