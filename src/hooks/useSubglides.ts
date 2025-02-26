import { createStore } from "solid-js/store";
// types
import { UseGlideState } from "../types/Glide";

const defaultState = () => ({
  pages: {},
  lastGlideCurrentlyLoaded: null,
  loading: false,
});

const useSubglides = () => {
  const [store, setStore] = createStore<UseGlideState>(defaultState());

  return { store };
};

export default useSubglides;
