import { createSignal, onMount } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { FirebaseError } from "firebase/app";
import { QueryDocumentSnapshot } from "firebase/firestore";
// types
import { Glide } from "../types/Glide";
// api
import { getGlides } from "../api/glide";

type State = {
  pages: {
    [key: string]: { glides: Glide[] };
  };
  loading: boolean;
  lastGlideCurrentlyLoaded: QueryDocumentSnapshot | null;
};

const createInitState = () => ({
  pages: {},
  loading: false,
  lastGlideCurrentlyLoaded: null,
});

const useGlides = () => {
  const [page, setpage] = createSignal(1);
  const [store, setStore] = createStore<State>(createInitState());

  onMount(() => {
    loadGlides();
  });

  const loadGlides = async () => {
    const _page = page();
    setStore("loading", true);

    try {
      const { glides, lastGlideCurrentlyLoaded } = await getGlides();

      if (glides.length > 0) {
        setStore(
          produce((store) => {
            store.pages[_page] = { glides };
          })
        );
      }

      setStore("lastGlideCurrentlyLoaded", lastGlideCurrentlyLoaded);
    } catch (error) {
      const message = (error as FirebaseError).message;
      console.log(message);
    } finally {
      setStore("loading", false);
    }

    getGlides();
  };

  const addGlide = (glide: Glide | undefined) => {
    if (!glide) return;

    const page = 1;

    setStore(
      produce((store) => {
        if (!store.pages[page]) {
          store.pages[page] = { glides: [] };
        }

        store.pages[page].glides.unshift({ ...glide });
      })
    );
  };

  return { page, loadGlides, addGlide, store };
};

export default useGlides;
