import { createSignal, onMount } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { FirebaseError } from "firebase/app";
import { Unsubscribe } from "firebase/firestore";
// types
import { Glide, UseGlideState } from "../types/Glide";
// api
import * as api from "../api/glide";
// context
import { useAuthState } from "../context/auth";

type State = UseGlideState & {
  newGlides: Glide[];
};

const createInitState = () => ({
  pages: {},
  loading: false,
  lastGlideCurrentlyLoaded: null,
  newGlides: [],
});

const useGlides = () => {
  const { user } = useAuthState()!;
  const [page, setpage] = createSignal(1);
  const [store, setStore] = createStore<State>(createInitState());

  let unsubscribe: Unsubscribe;

  onMount(() => {
    loadGlides();
  });

  const loadGlides = async () => {
    const _page = page();

    if (_page > 1 && !store.lastGlideCurrentlyLoaded) {
      return;
    }

    setStore("loading", true);

    try {
      const { glides, lastGlideCurrentlyLoaded } = await api.getGlides(
        user!,
        store.lastGlideCurrentlyLoaded
      );

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

  const subscribeToGlides = () => {
    if (user?.following.length == 0) {
      return;
    }

    unsubscribe = api.subscribeToGlides(user!, (newGlides: Glide[]) => {
      setStore("newGlides", newGlides);
    });
  };

  const unsubscribeFromGlides = () => {
    if (!!unsubscribe) {
      unsubscribe();
    }
  };

  const resubscribe = () => {
    unsubscribeFromGlides();
    subscribeToGlides();
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

  const displayNewGlides = () => {
    store.newGlides.forEach((newGlide) => {
      addGlide(newGlide);
    });

    setStore("newGlides", []);
    resubscribe();

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return {
    page,
    loadGlides,
    addGlide,
    store,
    subscribeToGlides,
    unsubscribeFromGlides,
    displayNewGlides,
  };
};

export default useGlides;
