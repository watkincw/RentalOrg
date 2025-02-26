import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { FirebaseError } from "firebase/app";
// types
import { GliderInputEvent, MessengerForm } from "../types/Form";
// context
import { useAuthState } from "../context/auth";
import { useUIDispatch } from "../context/ui";
// api
import { createGlide } from "../api/glide";

const useMessenger = () => {
  const { isAuthenticated, user } = useAuthState()!;
  const { addSnackbar } = useUIDispatch();
  const [loading, setLoading] = createSignal(false);
  const [form, setForm] = createStore<MessengerForm>({
    content: "",
  });

  const handleInput = (e: GliderInputEvent) => {
    const { name, value } = e.currentTarget;
    setForm(name, value);
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      addSnackbar({ message: "You must be logged in", type: "error" });
      return;
    }

    setLoading(true);

    const glide = {
      ...form,
      uid: user!.uid,
    };

    try {
      const newGlide = await createGlide(glide);
      newGlide.user = {
        userName: user!.userName,
        avatar: user!.avatar,
      };

      addSnackbar({ message: "Glide Created!", type: "success" });
      setForm({ content: "" });

      return newGlide;
    } catch (error) {
      const message = (error as FirebaseError).message;
      addSnackbar({ message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return {
    handleInput,
    handleSubmit,
    form,
    loading,
  };
};

export default useMessenger;
