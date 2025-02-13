import { A } from "@solidjs/router";
import { Component, Show } from "solid-js";
// hooks
import useForm, {
  firstLetterUppercase,
  FormError,
  maxLengthValidator,
  minLengthValidator,
  requiredValidator,
} from "../hooks/useForm";
// types
import { RegisterForm } from "../types/Form";

const RegisterScreen: Component = () => {
  const { handleInput, submitForm, validate, errors } = useForm<RegisterForm>({
    fullName: "",
    userName: "",
    email: "",
    avatar: "",
    password: "",
    passwordConfirmation: "",
  });

  // we want to get the data from the form when the form is submitted
  const onFormSubmit = (form: RegisterForm) => {
    console.log(form);
  };

  return (
    <div class="flex-it justify-center items-center h-full">
      <div class="text-white text-4xl font-bold">Glider - Create Account</div>
      <div class="mt-10 flex-it h-100 xs:w-100 w-full bg-white p-10 rounded-2xl">
        <div class="flex-it">
          <form class="flex-it">
            <div class="flex-it overflow-hidden sm:rounded-md">
              <div class="flex-it">
                <div class="flex-it">
                  <div class="flex-it py-2">
                    <label class="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                      onInput={handleInput}
                      use:validate={[requiredValidator, firstLetterUppercase]}
                      type="text"
                      name="fullName"
                      id="fullName"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    <FormError>{errors["fullName"]}</FormError>
                  </div>

                  <div class="flex-it py-2">
                    <label class="block text-sm font-medium text-gray-700">User Name</label>
                    <input
                      onInput={handleInput}
                      use:validate={[
                        requiredValidator,
                        maxLengthValidator,
                        (element) => minLengthValidator(element, 4),
                      ]}
                      type="text"
                      name="userName"
                      id="userName"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    <FormError>{errors["userName"]}</FormError>
                  </div>

                  <div class="flex-it py-2">
                    <label class="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      onInput={handleInput}
                      use:validate={[requiredValidator]}
                      type="text"
                      name="email"
                      id="email"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    <FormError>{errors["email"]}</FormError>
                  </div>

                  <div class="flex-it py-2">
                    <label class="block text-sm font-medium text-gray-700">Profile Picture: (optional)</label>
                    <input
                      onInput={handleInput}
                      type="text"
                      name="avatar"
                      id="avatar"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div class="flex-it py-2">
                    <label class="block text-sm font-medium text-gray-700">Password</label>
                    <input
                      onInput={handleInput}
                      use:validate={[requiredValidator, (ele) => minLengthValidator(ele, 5)]}
                      type="password"
                      name="password"
                      id="password"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    <FormError>{errors["password"]}</FormError>
                  </div>

                  <div class="flex-it py-2">
                    <label class="block text-sm font-medium text-gray-700">
                      Password Confirmation
                    </label>
                    <input
                      onInput={handleInput}
                      use:validate={[requiredValidator]}
                      type="password"
                      name="passwordConfirmation"
                      id="passwordConfirmation"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    <FormError>{errors["passwordConfirmation"]}</FormError>
                  </div>
                </div>
              </div>
              <div class="text-sm text-gray-600 pb-4">
                Already Registered?{" "}
                <A
                  class="underline"
                  href="/auth/login">
                  Go to Login
                </A>
              </div>
              <div class="flex-it py-2">
                <button
                  onClick={submitForm(onFormSubmit)}
                  type="button"
                  class="
                  bg-blue-400 hover:bg-blue-500 focus:ring-0
                  disabled:cursor-not-allowed disabled:bg-gray-400
                  inline-flex justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-offset-2">
                  Register
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;
