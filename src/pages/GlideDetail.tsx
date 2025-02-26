import { useParams } from "@solidjs/router";
import { createEffect, createResource, onMount, Show } from "solid-js";
import { FaSolidArrowLeft } from "solid-icons/fa";
// components
import MainLayout from "../components/layouts/Main";
import GlidePost from "../components/glides/GlidePost";
import Messenger from "../components/utils/Messenger";
import PaginatedGlides from "../components/glides/PaginatedGlides";
import { CenteredDataLoader } from "../components/utils/DataLoader";
// api
import { getGlideById } from "../api/glide";
// types
import { User } from "../types/User";
import { Glide } from "../types/Glide";
// hooks
import useSubglides from "../hooks/useSubglides";

const GlideDetailPage = () => {
  const params = useParams();

  const onGlideLoaded = (glide: Glide) => {
    resetPagination();
    loadGlides(glide.lookup!);
  };

  const [data, { mutate, refetch }] = createResource(async () => {
    const glide = await getGlideById(params.id, params.uid);
    onGlideLoaded(glide);
    return glide;
  });

  const { store, page, loadGlides, addSubglide, resetPagination } = useSubglides();
  const user = () => data()?.user as User;

  createEffect(() => {
    if (!data.loading && data()?.id !== params.id) {
      refetch();
    }
  });

  const onGlideAdded = (newGlide?: Glide) => {
    const glide = data()!;

    mutate({
      ...glide,
      subglidesCount: glide.subglidesCount + 1,
    });

    addSubglide(newGlide);
  };

  return (
    <MainLayout
      pageTitle={
        <div onClick={() => history.back()}>
          <div class="flex-it flex-row items-center text-xl cursor-pointer">
            <FaSolidArrowLeft />
            <div class="ml-5 font-bold">Back</div>
          </div>
        </div>
      }
    >
      <Show
        when={!data.loading}
        fallback={<CenteredDataLoader />}
      >
        <GlidePost glide={data()!} />
        <div class="p-4 border-b-1 border-solid border-grey-700">
          <div class="text-sm italis text-gray-300 mb-2 ml-4">Replying to {user().userName}</div>
          <Messenger
            replyTo={data()?.lookup}
            showAvatar={false}
            onGlideAdded={onGlideAdded}
          />
        </div>
        <PaginatedGlides
          page={page}
          pages={store.pages}
          loading={store.loading}
          loadMoreGlides={() => Promise.resolve()}
        />
      </Show>
    </MainLayout>
  );
};

export default GlideDetailPage;
