import { Accessor, For, ParentComponent, Show } from "solid-js";
import { createStore, produce } from "solid-js/store";
// types
import { Form, FormErrors, GliderInputEvent, SubmitCallback } from "../types/Form";

declare module "solid-js" {
  namespace JSX {
    interface Directives {
      validate: Validator[];
    }
  }
}

type Validator = (element: HTMLInputElement, ...rest: any[]) => (form: Form) => string;
type ValidatorConfig = { element: HTMLInputElement; validators: Validator[] };

const niceName = (text: string) => {
  const words = text.split(/(?=[A-Z])/);

  return words
    .map((word, i) => {
      return word[0].toUpperCase() + word.substring(1);
    })
    .join(" ");
};

export const FormError: ParentComponent = (props) => {
  const errors = () => (props.children as string[]) || [];
  return (
    <Show when={errors().length > 0}>
      <div class="flex-it grow text-xs bg-red-400 text-white p-3 pl-3 mt-1 rounded-md">
        <For each={errors()}>{(error) => <div>{error}</div>}</For>
      </div>
    </Show>
  );
};

export const compareWith: Validator = (element: HTMLInputElement, fieldName: string) => (form: Form) => {
  if (element.value.length === 0) return "";

  const compareToValue = form[fieldName];

  return element.value !== compareToValue ? `Passwords to not match` : "";
};

export const requiredValidator: Validator = (element: HTMLInputElement) => (form: Form) => {
  return element.value.length === 0 ? `${niceName(element.name)} is required` : "";
};

export const minLengthValidator: Validator =
  (element: HTMLInputElement, minLength = 6) =>
  (form: Form) => {
    if (element.value.length === 0 || element.value.length > minLength) {
      return "";
    }

    return `${niceName(element.name)} must be at least ${minLength + 1} charascters`;
  };

export const maxLengthValidator: Validator =
  (element: HTMLInputElement, maxLength = 17) =>
  (form: Form) => {
    if (element.value.length === 0 || element.value.length < maxLength) {
      return "";
    }

    return `${niceName(element.name)} must be ${maxLength - 1} charascters or elss`;
  };

export const firstLetterUppercase = (element: HTMLInputElement) => (form: Form) => {
  const { value } = element;

  if (value.length === 0) {
    return "";
  }

  return value[0] !== value[0].toUpperCase() ? `${niceName(element.name)} first letter should be uppercased` : "";
};

const useForm = <T extends Form>(initialForm: T) => {
  const [form, setForm] = createStore(initialForm);
  const [errors, setErrors] = createStore<FormErrors>();

  const validatorFields: { [key: string]: ValidatorConfig } = {};

  const isValid = () => {
    const keys = Object.keys(errors);

    if (keys.length === 0) {
      return false;
    }

    return !keys.some((errorKey) => {
      return errors[errorKey].length > 0;
    });
  };

  const handleInput = (e: GliderInputEvent) => {
    const { name, value } = e.currentTarget;

    // name - "fullname", "nickName", "email", ...
    setForm(name as any, value as any);
  };

  const submitForm = (submitCallback: SubmitCallback<T>) => () => {
    for (const field in validatorFields) {
      const config = validatorFields[field];
      checkValidity(config)();
    }

    if (isValid()) {
      submitCallback(form);
    }
  };

  const validate = (ref: HTMLInputElement, accessor: Accessor<Validator[]>) => {
    const validators = accessor() || [];
    let config: ValidatorConfig;

    validatorFields[ref.name] = config = { element: ref, validators };

    ref.onblur = checkValidity(config);
    ref.oninput = () => {
      if (!errors[ref.name]) return;

      checkValidity(config)();
    };
  };

  const checkValidity =
    ({ element, validators }: ValidatorConfig) =>
    () => {
      setErrors(element.name, []);

      for (const validator of validators) {
        const message = validator(element)(form);

        if (!!message) {
          setErrors(
            produce((errors) => {
              errors[element.name].push(message);
            })
          );
        }
      }

      // console.log(JSON.stringify(errors));
    };

  return {
    handleInput,
    submitForm,
    validate,
    errors,
  };
};

export default useForm;
