import { Component, onCleanup, onMount, Show } from "solid-js";
import { Portal } from "solid-js/web";
// components
import MainLayout from "../components/layouts/Main";
import Messenger from "../components/utils/Messenger";
import Button from "../components/utils/Button";
import PaginatedGlides from "../components/glides/PaginatedGlides";
// hooks
import useGlides from "../hooks/useGlides";

const HomeScreen: Component = () => {
  const {
    store,
    addGlide,
    page,
    loadGlides,
    subscribeToGlides,
    unsubscribeFromGlides,
  } = useGlides();

  onMount(() => {
    subscribeToGlides();
  });

  onCleanup(() => {
    unsubscribeFromGlides();
  });

  return (
    <MainLayout pageTitle="Home">
      <Messenger onGlideAdded={addGlide} />
      <div class="h-px bg-gray-700 my-1" />
      <Show when={store.newGlides.length >= 3}>
        <Portal>
          <div class="fixed top-2 z-100 left-2/4 -translate-x-1/2">
            <Button onClick={() => alert("Hi there")}>
              <span>Display New Glides</span>
            </Button>
          </div>
        </Portal>
      </Show>
      <PaginatedGlides
        page={page}
        pages={store.pages}
        loading={store.loading}
        loadMoreGlides={loadGlides}
      />
    </MainLayout>
  );
};

export default HomeScreen;
