import { Component, ParentProps } from "solid-js";
// componenmts/snackbar
import SnackbarContainer from "./components/snackbar/Container";

const App: Component<ParentProps> = (props) => {
  return (
    <>
      <div id="popups" />
      <SnackbarContainer />
      {props.children}
    </>
  );
};

export default App;
