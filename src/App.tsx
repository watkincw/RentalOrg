import { Component, ParentProps } from "solid-js";

const App: Component<ParentProps> = (props) => {
  return (
    <>
      <div id="popups" />
      {props.children}
    </>
  );
};

export default App;
