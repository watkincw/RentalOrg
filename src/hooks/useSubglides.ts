import { createSignal } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { FirebaseError } from "firebase/app";
// types
import { UseGlideState } from "../types/Glide";
// api
import * as api from "../api/glide";

const defaultState = () => ({
  pages: {},
  lastGlideCurrentlyLoaded: null,
  loading: false,
});

const useSubglides = () => {
  const [store, setStore] = createStore<UseGlideState>(defaultState());
  const [page, setpage] = createSignal(1);

  const loadGlides = async (glideLookup: string) => {
    const _page = page();

    if (_page > 1 && !store.lastGlideCurrentlyLoaded) {
      console.log("--- ALL DATA LOADED ---");
      return;
    }

    setStore("loading", true);

    try {
      const { glides, lastGlideCurrentlyLoaded } = await api.getSubgldies(glideLookup);

      if (glides.length > 0) {
        setStore(
          produce((store) => {
            store.pages[_page] = { glides };
          })
        );

        setpage(_page + 1);
      }

      setStore("lastGlideCurrentlyLoaded", lastGlideCurrentlyLoaded);
    } catch (error) {
      const message = (error as FirebaseError).message;
      console.log(message);
    } finally {
      setStore("loading", false);
    }
  };

  return { store, loadGlides, page };
};

export default useSubglides;
