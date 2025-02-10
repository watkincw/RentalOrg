import { Component, ParentProps } from "solid-js";

const App: Component<ParentProps> = (props) => {
  return (
    <>
      {props.children}
    </>
  )
};

export default App;
