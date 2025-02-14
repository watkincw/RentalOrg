// types
import { RegisterForm } from "../types/Form";
// api
import { register } from "../api/auth";

const useRegister = () => {
  const registerUser = async (registerForm: RegisterForm) => {
    const user = await register(registerForm);
    console.log(user);
  };

  return {
    registerUser,
  };
};

export default useRegister;
