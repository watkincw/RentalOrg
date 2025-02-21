import { createSignal, onMount } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { FirebaseError } from "firebase/app";
// types
import { Glide } from "../types/Glide";
// api
import { getGlides } from "../api/glide";

type State = {
  pages: {
    [key: string]: { glides: Glide[] };
  };
  loading: boolean;
};

const createInitState = () => ({ pages: {}, loading: false });

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
      const { glides } = await getGlides();

      if (glides.length > 0) {
        setStore(
          produce((store) => {
            store.pages[_page] = { glides };
          })
        );
      }
    } catch (error) {
      const message = (error as FirebaseError).message;
      console.log(message);
    } finally {
      setStore("loading", false);
    }

    getGlides();
  };

  const addGlide = (glide: Glide) => {
    const page = 1;

    setStore(
      produce((store) => {
        if (!store.pages[page]) {
          store.pages[page] = { glides: [] };
        }

        // store.pages[page].glides = [{ ...glide }, ...store.pages[page].glides];
        store.pages[page].glides.unshift({ ...glide });
      })
    );
  };

  return { page, loadGlides, addGlide, store };
};

export default useGlides;
