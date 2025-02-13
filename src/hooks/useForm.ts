import { Accessor } from "solid-js";
import { createStore } from "solid-js/store";
// types
import { Form, GliderInputEvent, SubmitCallback } from "../types/Form";

const useForm = <T extends Form>(initialForm: T) => {
  const [form, setForm] = createStore(initialForm);
  const [errors, setErrors] = createStore<Form>();

  const handleInput = (e: GliderInputEvent) => {
    const { name, value } = e.currentTarget;

    // name - "fullname", "nickName", "email", ...
    setForm(name as any, value as any);
  };

  const submitForm = (submitCallback: SubmitCallback<T>) => () => {
    submitCallback(form);
  };

  const validate = (ref: HTMLInputElement, accessor: Accessor<number>) => {
    const value = accessor();

    ref.onblur = checkValidity(ref);
  };

  const validator = (ref: HTMLInputElement) => {
    return false;
  };

  const checkValidity = (ref: HTMLInputElement) => () => {
    const message = "Error error error";
    const isValid = validator(ref);

    if (!isValid) {
      setErrors(ref.name, message);
    } else {
      setErrors(ref.name, "");
    }

    console.log(JSON.stringify(errors));
  };

  return {
    handleInput,
    submitForm,
    validate,
  };
};

export default useForm;
