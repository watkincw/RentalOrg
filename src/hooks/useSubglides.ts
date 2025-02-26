import { createSignal } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { FirebaseError } from "firebase/app";
// types
import { Glide, UseGlideState } from "../types/Glide";
// api
import * as api from "../api/glide";

const defaultState = () => ({
  pages: {},
  lastGlideCurrentlyLoaded: null,
  loading: false,
});

const useSubglides = () => {
  const [store, setStore] = createStore<UseGlideState>(defaultState());
  const [page, setPage] = createSignal(1);

  const loadGlides = async (glideLookup: string) => {
    const _page = page();

    if (_page > 1 && !store.lastGlideCurrentlyLoaded) {
      return;
    }

    setStore("loading", true);

    try {
      const { glides, lastGlideCurrentlyLoaded } = await api.getSubgldies(
        glideLookup,
        store.lastGlideCurrentlyLoaded
      );

      if (glides.length > 0) {
        setStore(
          produce((store) => {
            store.pages[_page] = { glides };
          })
        );

        setPage(_page + 1);
      }

      setStore("lastGlideCurrentlyLoaded", lastGlideCurrentlyLoaded);
    } catch (error) {
      const message = (error as FirebaseError).message;
      console.log(message);
    } finally {
      setStore("loading", false);
    }
  };

  const addSubglide = (glide: Glide | undefined) => {
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

  const resetPagination = () => {
    setStore(
      produce((store) => {
        for (let i = 1; i <= page(); i++) {
          store.pages[i] = {
            glides: [],
          };
        }

        store.lastGlideCurrentlyLoaded = null;
      })
    );

    setPage(1);
  };

  return { store, loadGlides, page, addSubglide, resetPagination };
};

export default useSubglides;
