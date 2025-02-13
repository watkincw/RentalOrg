import { createStore } from "solid-js/store";
// types
import { Form, GliderInputEvent, SubmitCallback } from "../types/Form";

const useForm = <T extends Form>(initialForm: T) => {
  const [form, setForm] = createStore(initialForm);

  const handleInput = (e: GliderInputEvent) => {
    const { name, value } = e.currentTarget;

    // name - "fullname", "nickName", "email", ...
    setForm(name as any, value as any);
  };

  const submitForm = (submitCallback: SubmitCallback<T>) => () => {
    submitCallback(form);
  };

  return {
    handleInput,
    submitForm,
  };
};

export default useForm;
