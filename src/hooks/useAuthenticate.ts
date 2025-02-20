import { FirebaseError } from "firebase/app";
import { createSignal } from "solid-js";
// api
import { authenticate, AuthType } from "../api/auth";
// types
import { AuthForm } from "../types/Form";
// context
import { useUIDispatch } from "../context/ui";

const useAuthenticate = (authType: AuthType) => {
  const [loading, setLoading] = createSignal(false);
  const { addSnackbar } = useUIDispatch();

  const authUser = async (form: AuthForm) => {
    setLoading(true);
    try {
      await authenticate(form, authType);
      addSnackbar({ message: "Logged in Successful", type: "success" });
    } catch (e) {
      const message = (e as FirebaseError).message;
      addSnackbar({ message, type: "error" });
      console.log(message);
    } finally {
      setLoading(false);
    }
  };

  return { authUser, loading };
};

export default useAuthenticate;
