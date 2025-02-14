import { createUserWithEmailAndPassword } from "firebase/auth";
// types
import { RegisterForm } from "../types/Form";
// db
import { firebaseAuth } from "../db";

const registerUser = (form: RegisterForm) => {
  return createUserWithEmailAndPassword(firebaseAuth, form.email, form.password);
};

export { registerUser };
