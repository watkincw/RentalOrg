import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";
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

  const handleSubmit = () => {
    if (!isAuthenticated) {
      addSnackbar({ message: "You must be logged in", type: "error" });
      return;
    }

    setLoading(true);

    const glide = {
      ...form,
      uid: user!.uid,
    };

    createGlide(glide);

    setForm({ content: "" });
    setLoading(false);
  };

  return {
    handleInput,
    handleSubmit,
    form,
  };
};

export default useMessenger;
