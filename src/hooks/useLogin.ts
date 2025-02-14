// api
import { login } from "../api/auth";
// types
import { AuthForm } from "../types/Form";

const useLogin = () => {
  const loginUser = (loginForm: AuthForm) => {
    login(loginForm);
  };

  return { loginUser };
};

export default useLogin;
