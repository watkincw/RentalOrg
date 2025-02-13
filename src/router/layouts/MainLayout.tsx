import { useNavigate } from "@solidjs/router";
import { Component, ParentProps, onMount } from "solid-js";
// context
import { useAuthState } from "../../context/auth";
// import PersistenceProvider from "../../context/persistence";

const MainLayout: Component<ParentProps> = (props) => {
  const authState = useAuthState();
  const navigate = useNavigate();

  onMount(() => {
    if (!authState?.isAuthenticated) {
      navigate("/auth/login", { replace: true });
    }
  });

  if (!authState?.isAuthenticated) {
    return null;
  }

  return (
    <>
    {/* <PersistenceProvider> */}
      <div>I am MainLayout</div>
      {props.children}
    {/* </PersistenceProvider> */}
    </>
  );
};

export default MainLayout;
