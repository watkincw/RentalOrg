import { Component, For } from "solid-js";
// components
import MainLayout from "../components/layouts/Main";
import GlidePost from "../components/glides/GlidePost";
import Messenger from "../components/utils/Messenger";
// hooks
import useGlides from "../hooks/useGlides";

const HomeScreen: Component = () => {
  const { store } = useGlides();

  return (
    <MainLayout>
      <Messenger />
      <div class="h-px bg-gray-700 my-1" />
      <For each={store.glides}>{(glide) => <GlidePost glide={glide} />}</For>
    </MainLayout>
  );
};

export default HomeScreen;
