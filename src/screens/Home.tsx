import { Component, For } from "solid-js";
import { createStore, produce } from "solid-js/store";
// components
import MainLayout from "../components/layouts/Main";
import GlidePost from "../components/glides/GlidePost";
import Messenger from "../components/utils/Messenger";
// types
import { Glide } from "../types/Glide";

const HomeScreen: Component = () => {
  const [glides, setGlides] = createStore({
    items: [] as Glide[],
  });

  return (
    <MainLayout>
      <Messenger />
      <div class="h-px bg-gray-700 my-1" />
      <For each={glides.items}>{(glide) => <GlidePost glide={glide} />}</For>
    </MainLayout>
  );
};

export default HomeScreen;
