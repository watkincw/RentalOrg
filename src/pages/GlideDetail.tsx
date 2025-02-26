import { useParams } from "@solidjs/router";
// components
import MainLayout from "../components/layouts/Main";
import { onMount } from "solid-js";
import { getGlideById } from "../api/glide";

const GlideDetail = () => {
  const params = useParams();

  onMount(async () => {
    const glide = await getGlideById(params.id, params.uid);
  });

  return (
    <MainLayout pageTitle="Detail">
      <div>id: {params.id}</div>
      <div>uid: {params.uid}</div>
    </MainLayout>
  );
};

export default GlideDetail;
