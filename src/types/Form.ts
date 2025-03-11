export type UploadImage = {
  buffer: ArrayBuffer;
  name: string;
  previewUrl: string;
};

export type GliderFileEvent = {
  target: Element & { files?: FileList };
  currentTarget: HTMLInputElement;
};

export type RentalOrgInputEvent = InputEvent & {
  currentTarget: HTMLInputElement | HTMLTextAreaElement;
  target: Element;
};

export type Form = { [key: string]: string | boolean };
export type FormErrors = { [key: string]: string[] };

export type MessengerForm = {
  content: string;
  mediaUrl?: string;
} & Form;

export type AuthForm = {
  email: string;
  password: string;
};

export type RegisterForm = {
  fullName: string;
  userName: string;
  email: string;
  avatar: string;
  password: string;
  passwordConfirmation: string;
  isLandlord?: boolean;
  isRenter?: boolean;
} & AuthForm;

export type SubmitCallback<T extends Form> = (f: T) => void;
