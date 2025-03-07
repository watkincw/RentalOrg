import { IoCloseCircle } from "solid-icons/io";
import { Component, createEffect, createSignal, mergeProps, onMount } from "solid-js";
// context
import { SnackbarMessage } from "../../context/ui";

type Props = {
  onClose: () => void;
  autoHideDuration?: number;
} & SnackbarMessage;

export const Snackbar: Component<Props> = (initialProps) => {
  let props = mergeProps({ autoHideDuration: 10000 }, initialProps);
  const [duration, setDuration] = createSignal(props.autoHideDuration);

  const completed = () => Math.floor((duration() / props.autoHideDuration) * 100);

  let timerId: number;

  onMount(() => {
    timerId = window.setInterval(() => {
      setDuration(duration() - 50);
    }, 50);
  });

  createEffect(() => {
    if (duration() <= 0) {
      window.clearInterval(timerId);
      props.onClose();
    }
  });

  return (
    <div
      class="min-w-68 text-white flex-it font-bold rounded-md md:max-w-xs w-full text-sm shadow-md"
      classList={{
        "bg-blue-400": props.type === "success",
        "bg-red-700": props.type === "error",
        "bg-yellow-600": props.type === "warning",
      }}
    >
      <div class="flex-it flex-row-reverse p-1">
        <button
          onclick={props.onClose}
          class="text-xl rounded-full"
        >
          <IoCloseCircle />
        </button>
      </div>
      <div class="flex-it px-2 pb-3">{props.message}</div>
      <div
        style={{ width: `${completed()}%` }}
        class="bg-black opacity-40 text-right h-2"
      ></div>
    </div>
  );
};
