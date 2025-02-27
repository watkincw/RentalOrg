import { Component, createSignal, ParentComponent, Show } from "solid-js";
import { Portal } from "solid-js/web";
import Button from "./Button";

type Props = {
  openComponent: Component;
};

const Modal: ParentComponent<Props> = (props) => {
  const [isOpen, setIsOpen] = createSignal();

  return (
    <>
      <props.openComponent />
      <Show when={isOpen()}>
        <Portal>
          <div class="openModal">
            <div class="modal fixed min-w-160 top-14 left-2/4 p-8 -translate-x-1/2 rounded-2xl">
              {props.children}
            </div>
          </div>
        </Portal>
      </Show>
    </>
  );
};

export default Modal;
