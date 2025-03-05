import { Component } from "solid-js";
import { CenteredDataLoader } from "./DataLoader";

type Props = {
  size: number;
};

const Loader: Component<Props> = (props) => {
  return (
    <div class="flex-it text-white justify-center items-center h-full">
      <CenteredDataLoader />
    </div>
  );
};

export default Loader;
