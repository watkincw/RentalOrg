import { useParams } from "@solidjs/router";
import { createResource, onMount, Show } from "solid-js";
import { FaSolidArrowLeft } from "solid-icons/fa";
// components
import MainLayout from "../components/layouts/Main";
import GlidePost from "../components/glides/GlidePost";
import { CenteredDataLoader } from "../components/utils/DataLoader";
// api
import { getGlideById } from "../api/glide";

const GlideDetail = () => {
  const params = useParams();
  const [data] = createResource(() => getGlideById(params.id, params.uid));

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
      </Show>
    </MainLayout>
  );
};

export default GlideDetail;
