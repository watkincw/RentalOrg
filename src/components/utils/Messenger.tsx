import { Component, mergeProps, Show } from "solid-js";
import { FaRegularImage } from "solid-icons/fa";
import defaultPic from "../../assets/defaultProfilePicture.jpg";
// components
import Button from "./Button";
// context
import { useAuthState } from "../../context/auth";
// hooks
import useMessenger from "../../hooks/useMessenger";
// types
import { GliderFileEvent, GliderInputEvent } from "../../types/Form";
import { Glide } from "../../types/Glide";

type Props = {
  onGlideAdded: (g: Glide | undefined) => void;
  showAvatar?: boolean;
  replyTo?: string;
};

const Messenger: Component<Props> = (initialProps) => {
  const props = mergeProps({ showAvatar: true }, initialProps);
  const { user } = useAuthState()!;
  const { handleInput, handleSubmit, form, loading, image, setImage } = useMessenger(props.replyTo);

  const sendDisabled = () => loading() || form.content === "";

  const autoSize = (e: GliderInputEvent) => {
    const el = e.currentTarget;
    const { scrollHeight } = el;

    //set to 0, THEN set to 'auto height'
    el.style.height = "0px";
    el.style.height = scrollHeight + "px";
  };

  const handleImageSelection = (e: GliderFileEvent) => {
    const file = e.target.files![0];

    if (file) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);

      reader.onload = () => {
        const buffer = reader.result as ArrayBuffer;
        const buffer8Uint = new Uint8Array(buffer);
        const blob = new Blob([buffer8Uint], { type: file.type });
        const urlCreator = window.URL || window.webkitURL;
        const previewUrl = urlCreator.createObjectURL(blob);

        setImage({ buffer, name: file.name, previewUrl });
      };
    }
  };

  return (
    <div class="flex-it py-1 px-4 flex-row">
      <Show when={props.showAvatar}>
        <div class="flex-it mr-4">
          <div class="w-12 h-12 overflow-visible cursor-pointer transition duration-200 hover:opacity-80">
            <img
              class="rounded-full"
              src={user?.avatar || defaultPic}
            ></img>
          </div>
        </div>
      </Show>
      <div class="flex-it flex-grow">
        <div class="flex-it">
          <textarea
            value={form.content}
            onInput={(e) => {
              handleInput(e);
              autoSize(e);
            }}
            name="content"
            rows="1"
            id="glide"
            class="bg-transparent resize-none overflow-hidden block !outline-none !border-none border-transparent focus:border-transparent focus:ring-0 text-gray-100 text-xl w-full p-0"
            placeholder={"What's new?"}
          />
        </div>
        <Show when={image().previewUrl.length > 0}>
          <div class="flex-it max-w-52 p-4">
            <img src={image().previewUrl} />
          </div>
        </Show>
        <div class="flex-it mb-1 flex-row xs:justify-between items-center">
          <div class="flex-it mt-3 mr-3 cursor-pointer text-white hover:text-blue-400 transition">
            <div class="upload-btn-wrapper">
              <FaRegularImage
                class="cursor-pointer"
                size={18}
              />
              <input
                onChange={(e) => handleImageSelection(e as GliderFileEvent)}
                type="file"
                name="myfile"
                accept="image/*"
              />
            </div>
          </div>
          <div class="flex-it w-32 mt-3 cursor-pointer">
            <Button
              disabled={sendDisabled()}
              onClick={async () => {
                const glide = await handleSubmit();
                initialProps.onGlideAdded(glide);
              }}
            >
              <span>Glide It</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messenger;
