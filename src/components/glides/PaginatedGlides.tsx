import { Accessor, Component, For, onCleanup, onMount, Show } from "solid-js";
// components
import GlidePost from "./GlidePost";
import { CenteredDataLoader } from "../utils/DataLoader";
// types
import { Glide } from "../../types/Glide";

type Props = {
  page: Accessor<number>;
  pages: {
    [key: string]: { glides: Glide[] };
  };
  loading: boolean;
  loadMoreGlides: () => Promise<void>;
};

const PaginatedGlides: Component<Props> = (props) => {
  let lastItemRef: HTMLDivElement;

  onMount(() => {
    window.addEventListener("scroll", loadNewItems);
  });

  onCleanup(() => {
    window.removeEventListener("scroll", loadNewItems);
  });

  const loadNewItems = () => {
    if (lastItemRef!.getBoundingClientRect().top <= window.innerHeight + 100) {
      if (!props.loading) {
        props.loadMoreGlides();
      }
    }
  };

  return (
    <>
      <For each={Array.from({ length: props.page() })}>
        {(_, i) => (
          <For each={props.pages[i() + 1]?.glides}>{(glide) => <GlidePost glide={glide} />}</For>
        )}
      </For>
      <Show when={props.loading}>
        <CenteredDataLoader />
      </Show>
      <Show when={!props.loading && props.pages[1]?.glides?.length === 0}>
        <div class="flex-it">
          <div class="bg-yellow-700 mt-6 p-6 rounded-lg mx-4">No Replies</div>
        </div>
      </Show>
      <div ref={lastItemRef!}></div>
    </>
  );
};

export default PaginatedGlides;
