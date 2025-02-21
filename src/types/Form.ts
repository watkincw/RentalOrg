export type GliderInputEvent = InputEvent & {
  currentTarget: HTMLInputElement | HTMLTextAreaElement;
  target: Element;
};

export type Form = { [key: string]: string };
export type FormErrors = { [key: string]: string[] };

export type MessengerForm = {
  content: string;
} & Form;

export type AuthForm = {
  email: string;
  password: string;
} & Form;

export type RegisterForm = {
  fullName: string;
  userName: string;
  email: string;
  avatar: string;
  password: string;
  passwordConfirmation: string;
} & AuthForm;

export type SubmitCallback<T extends Form> = (f: T) => void;
