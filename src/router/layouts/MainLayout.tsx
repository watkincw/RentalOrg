// // Below is the way it was done in the course

// import { Outlet } from "@solidjs/router";
// import { Component, onMount } from "solid-js";

// const MainLayout: Component = () => {
//   onMount(() => {
//     console.log("MainLayout is mounted");
//   });

//   return <Outlet />;
// }

// export default MainLayout;

// Below is the only solution I have been able to come across so far, however it requires changing some things elsewhere in the application as well.
// View './src/router/index.tsx' to see the first errors that popped up as a result of doing it this way instead of what is seen above/in the course.
// If I continue this way, more errors are going to arrise with the other 'component=' properties throughout the routing structure

import { Component, JSX, onMount } from "solid-js";

const MainLayout: Component<{ children: JSX.Element }> = (props) => {
  onMount(() => {
    console.log("MainLayout is mounted");
  });

  return (
    <>
      <div>I am MainLayout</div>
      {props.children}
    </>
  );
};

export default MainLayout;
