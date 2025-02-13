import { useNavigate } from "@solidjs/router";
import { Component, ParentProps, onMount } from "solid-js";
// context
import { useAuthState } from "../../context/auth";

const AuthLayout: Component<ParentProps> = (props) => {
  const authState = useAuthState()!;
  const navigate = useNavigate();

  onMount(() => {
    if (authState.isAuthenticated) {
      navigate("/", { replace: true });
    }
  });

  return props.children;
};

export default AuthLayout;
