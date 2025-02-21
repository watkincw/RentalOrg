import { onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { FirebaseError } from "firebase/app";
// types
import { Glide } from "../types/Glide";
// api
import { getGlides } from "../api/glide";

type State = {
  glides: Glide[];
  loading: boolean;
};

const createInitState = () => ({ glides: [], loading: false });

const useGlides = () => {
  const [store, setStore] = createStore<State>(createInitState());

  onMount(() => {
    loadGlides();
  });

  const loadGlides = async () => {
    setStore("loading", true);
    try {
      const { glides } = await getGlides();
      setStore("glides", glides);
    } catch (error) {
      const message = (error as FirebaseError).message;
      console.log(message);
    } finally {
      setStore("loading", false);
    }
    getGlides();
  };

  return { loadGlides, store };
};

export default useGlides;
