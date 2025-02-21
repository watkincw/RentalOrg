import { Component, For } from "solid-js";
// components
import MainLayout from "../components/layouts/Main";
import GlidePost from "../components/glides/GlidePost";
import Messenger from "../components/utils/Messenger";
// hooks
import useGlides from "../hooks/useGlides";

const HomeScreen: Component = () => {
  const { store, addGlide, page } = useGlides();

  return (
    <MainLayout>
      <Messenger onGlideAdded={addGlide}/>
      <div class="h-px bg-gray-700 my-1" />
      <For each={Array.from({ length: page() })}>
        {(_, i) => (
          <For each={store.pages[i() + 1]?.glides}>
            {(glide) => <GlidePost glide={glide} />}
          </For>
        )}
      </For>
    </MainLayout>
  );
};

export default HomeScreen;
