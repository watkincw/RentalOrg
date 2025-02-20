import { FirebaseError } from "firebase/app";
// api
import { createSignal } from "solid-js";
import { authenticate, AuthType } from "../api/auth";
// types
import { AuthForm } from "../types/Form";

const useAuthenticate = (authType: AuthType) => {
  const [loading, setLoading] = createSignal(false);

  const authUser = async (form: AuthForm) => {
    setLoading(true);
    try {
      await authenticate(form, authType);
    } catch (e) {
      const message = (e as FirebaseError).message;
      console.log(message);
    } finally {
      setLoading(false);
    }
  };

  return { authUser, loading };
};

export default useAuthenticate;
