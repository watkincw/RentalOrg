import { useParams } from "@solidjs/router";
import { createEffect, createResource, Show } from "solid-js";
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
// context
import { usePersistence } from "../context/persistence";

const GlideDetailPage = () => {
  const params = useParams();
  const persistence = usePersistence()!;

  const onGlideLoaded = (glide: Glide) => {
    resetPagination();
    loadGlides(glide.lookup!);
  };

  const [data, { mutate, refetch }] = createResource(async () => {
    const glide = await persistence.useRevalidate(
      `selectedGlide-${params.id}`,
      getGlideById(params.id, params.uid)
    );

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
      onGlideAdded={onGlideAdded}
      selectedGlide={data()}
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
        <PaginatedGlides
          page={page}
          pages={store.pages}
          loading={store.loading}
          loadMoreGlides={() => {
            const lookup = data()?.lookup!;
            return loadGlides(lookup);
          }}
        />

        <div class="min-h-screen flex flex-col">
          <div class="flex-1">{/* <!-- Your main content goes here --> */}</div>
          <div class="sticky bottom-0 p-4 border-1 border-solid border-grey-700 bg-blue-900">
            <div class="text-sm italic text-gray-300 mb-2 ml-4">Replying to {user().userName}</div>
            <Messenger
              replyTo={data()?.lookup}
              showAvatar={false}
              onGlideAdded={onGlideAdded}
            />
          </div>
        </div>
      </Show>
    </MainLayout>
  );
};

export default GlideDetailPage;
