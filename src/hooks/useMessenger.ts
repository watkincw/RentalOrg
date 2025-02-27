import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { FirebaseError } from "firebase/app";
// types
import { GliderInputEvent, MessengerForm, UploadImage } from "../types/Form";
// context
import { useAuthState } from "../context/auth";
import { useUIDispatch } from "../context/ui";
// api
import { createGlide, uploadImage } from "../api/glide";

const defaultImage = () => ({
  buffer: new ArrayBuffer(0),
  name: "",
  previewUrl: "",
});

const useMessenger = (replyTo?: string) => {
  const { isAuthenticated, user } = useAuthState()!;
  const { addSnackbar } = useUIDispatch();
  const [image, setImage] = createSignal<UploadImage>(defaultImage());
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

    const glideForm = { ...form, uid: user!.uid };

    try {
      if (image().buffer.byteLength > 0) {
        const downloadUrl = await uploadImage(image());
        glideForm.mediaUrl = downloadUrl;
      }

      const newGlide = await createGlide(glideForm, replyTo);
      newGlide.user = {
        userName: user!.userName,
        avatar: user!.avatar,
      };

      addSnackbar({ message: "Glide Created!", type: "success" });
      setForm({ content: "" });
      setImage(defaultImage());

      return newGlide;
    } catch (error) {
      const message = (error as FirebaseError).message;
      addSnackbar({ message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return { handleInput, handleSubmit, form, loading, image, setImage };
};

export default useMessenger;
