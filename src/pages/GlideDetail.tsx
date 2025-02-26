import { useParams } from "@solidjs/router";
import { createEffect, createResource, onMount, Show } from "solid-js";
import { FaSolidArrowLeft } from "solid-icons/fa";
// components
import MainLayout from "../components/layouts/Main";
import GlidePost from "../components/glides/GlidePost";
import { CenteredDataLoader } from "../components/utils/DataLoader";
import Messenger from "../components/utils/Messenger";
// api
import { getGlideById } from "../api/glide";
// types
import { User } from "../types/User";
// hooks
import useSubglides from "../hooks/useSubglides";

const GlideDetailPage = () => {
  const params = useParams();
  const [data] = createResource(() => getGlideById(params.id, params.uid));
  const { store, loadGlides } = useSubglides();

  createEffect(() => {
    const glide = data();
    if (!data.loading && !!glide && !!glide?.lookup) {
      loadGlides(glide?.lookup);
    }
  });

 

  const user = () => data()?.user as User;

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
            showAvatar={false}
            onGlideAdded={() => {}}
          />
        </div>
      </Show>
    </MainLayout>
  );
};

export default GlideDetailPage;
