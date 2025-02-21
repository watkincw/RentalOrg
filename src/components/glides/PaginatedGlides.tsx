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
    // console.log(lastItemRef!.getBoundingClientRect().top);

    if (lastItemRef!.getBoundingClientRect().top <= window.innerHeight + 100) {
      console.log("loading new items");
    }
  };

  return (
    <>
      <For each={Array.from({ length: props.page() })}>
        {(_, i) => (
          <For each={props.pages[i() + 1]?.glides}>
            {(glide) => <GlidePost glide={glide} />}
          </For>
        )}
      </For>
      <Show when={props.loading}>
        <CenteredDataLoader />
      </Show>
      <div ref={lastItemRef!}></div>
      <div class="h-96"></div>
    </>
  );
};

export default PaginatedGlides;
