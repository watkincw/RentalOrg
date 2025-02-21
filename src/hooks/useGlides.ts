import { onMount } from "solid-js";
import { createStore } from "solid-js/store";
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
  const [store, setStore] = createStore(createInitState());

  onMount(() => {
    loadGlides();
  });

  const loadGlides = () => {
    getGlides();
  };

  return { loadGlides, store };
};

export default useGlides;
