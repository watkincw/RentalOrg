import { Accessor, Component, For, Show } from "solid-js";
// components/glides
import GlidePost from "./GlidePost";
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
        <div class="flex-it justify-center items-center">Loading...</div>
      </Show>
    </>
  );
};

export default PaginatedGlides;
