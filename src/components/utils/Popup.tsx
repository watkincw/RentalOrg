import { Component, createEffect, createSignal, onCleanup, onMount, Show } from "solid-js";
import { Portal } from "solid-js/web";
// reactivity
import pageSize from "../../reactive/pageSize";
// hooks
import useLogout from "../../hooks/useLogout";

type Props = {
  opener: Component;
};

const Popup: Component<Props> = ({ opener: Opener }) => {
  const { logoutUser } = useLogout();
  const [isOpen, setIsOpen] = createSignal();

  let followTo: HTMLDivElement | undefined;
  let popup: HTMLDivElement | undefined;

  onMount(() => {
    window.addEventListener("click", closePopup);
  });

  onCleanup(() => {
    window.removeEventListener("click", closePopup);
  });

  createEffect(() => {
    if (isOpen() && pageSize.value()) {
      adjustPopup();
    }
  });

  const adjustPopup = () => {
    if (!!popup && !!followTo) {
      const position = followTo.getBoundingClientRect();
      popup.style.left = position.left + "px";
      popup.style.bottom = followTo.clientHeight + "px";
    }
  };

  const closePopup = (e: MouseEvent) => {
    if (isOpen() && !isPopupClicked(e)) {
      setIsOpen(false);
    }
  };

  const isPopupClicked = (e: MouseEvent) => {
    return popup?.contains(e.target as Node);
  };

  return (
    <div class="flex-it flex-grow">
      <div
        ref={followTo}
        onClick={(e) => {
          e.stopImmediatePropagation();
          setIsOpen(!isOpen());
        }}
      >
        <Opener />
      </div>
      <Show when={isOpen()}>
        <Portal mount={document.getElementById("popups") as Node}>
          <div
            ref={popup}
            class="flex-it hover:cursor-pointer fixed bg-gray-800 text-white popup z-10 rounded-2xl border-gray-700 border transition duration-1000"
          >
            <div class="w-72 min-w-68 max-h-120 min-h-8 flex-it overflow-auto">
              <div class="flex-it flex-grow flex-shrink py-3">
                <div
                  class="flex-it px-4 py-3 transition hover:bg-gray-700"
                  onclick={logoutUser}
                >
                  Logout
                </div>
              </div>
            </div>
          </div>
        </Portal>
      </Show>
    </div>
  );
};

export default Popup;
