import { Component, For } from "solid-js";
// components
import MainLayout from "../components/layouts/Main";
import Messenger from "../components/utils/Messenger";
import PaginatedGlides from "../components/glides/PaginatedGlides";
// hooks
import useGlides from "../hooks/useGlides";

const HomeScreen: Component = () => {
  const { store, addGlide, page } = useGlides();

  return (
    <MainLayout>
      <Messenger onGlideAdded={addGlide} />
      <div class="h-px bg-gray-700 my-1" />
      <PaginatedGlides
        page={page}
        pages={store.pages}
        loading={store.loading}
      />
    </MainLayout>
  );
};

export default HomeScreen;
