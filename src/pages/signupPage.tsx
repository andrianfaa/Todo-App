/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState } from "react";
import { Link } from "react-router-dom";
import type { SignUpRequest } from "services";
import { useSignupMutation } from "services";
import { Portal, ReactNotyf } from "utils";

type FormStateType = SignUpRequest;

type FormsType = {
  name: string;
  type: string;
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  pattern?: string;
  icon?: string;
};

function SignUpPage() {
  const [formState, setFormState] = useState<FormStateType>({
    email: "",
    password: "",
    name: "",
    projectUrl: process.env.REACT_APP_BASE_URL || "",
  });

  const [signup, { isLoading, isSuccess }] = useSignupMutation();

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let pattern: RegExp;

    if (name === "name") {
      pattern = /^[a-zA-Z0-9.@!#$%&_-\s]*$/;
    } else {
      pattern = /^[a-zA-Z0-9.@!#$%&_-]*$/;
    }

    const reg = new RegExp(pattern);
    const isValid = value.length > 1 ? reg.test(value) : true;

    if (!isValid) return;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await signup(formState)
      .unwrap()
      .then((res) => {
        if (res.statusCode === 201) {
          ReactNotyf.success("Successfully signed up!");
        }
      })
      .catch((err) => {
        console.log(err);
        ReactNotyf.error(err.data.message);
      });
  };

  const FormInput: FormsType[] = [
    {
      name: "name",
      type: "text",
      value: formState.name,
      placeholder: "Name",
      onChange: handleOnChange,
    },
    {
      name: "email",
      type: "email",
      value: formState.email,
      placeholder: "Email",
      onChange: handleOnChange,
    },
    {
      name: "password",
      type: "password",
      value: formState.password,
      placeholder: "Password",
      onChange: handleOnChange,
    },
  ];

  return (
    <div className="container lg:max-w-7xl min-h-screen mx-auto p-6 text-center flex flex-row items-center justify-center fade-in">
      <div className="w-full flex-1 hidden lg:flex lg:items-center lg:justify-center" />
      <div className="w-full flex-1 md:max-w-lg flex items-center justify-center">
        <div className="w-full lg:text-left">
          <form onSubmit={handleOnSubmit} className="max-w-full">
            <h1 className="mb-4">Sign Up</h1>
            <p className="mb-4">
              Sign up to get access to the full features of the application.
            </p>

            {FormInput.map(({
              type, placeholder, value, onChange, name,
            }) => (
              <div
                key={type}
                className="flex flex-col items-center mb-4 text-left"
              >
                <label htmlFor={type} className="block w-full">
                  {placeholder}
                </label>
                <input
                  type={type}
                  id={type}
                  name={name}
                  value={value}
                  onChange={onChange}
                  className="input-base mt-1 block w-full"
                  placeholder={placeholder}
                  disabled={isLoading}
                  title={placeholder}
                  required
                />
              </div>
            ))}

            <button
              type="submit"
              className="button-base button-primary block w-full"
              disabled={isLoading}
              title="Sign Up"
            >
              {isLoading ? (
                <span className="animate-pulse">...</span>
              ) : (
                <span>Sign Up</span>
              )}
            </button>
          </form>

          <p className="mt-6">
            Have an account?
            {" "}
            <Link to="/" className="text-primary" title="Login">
              Login
            </Link>
          </p>
        </div>
      </div>

      <Portal>
        {isSuccess && (
          <div className="modal-container">
            <div className="w-full max-w-md bg-white rounded px-4 py-8 text-center">
              <h2 className="modal-title mb-2">
                SignUp Successful!
              </h2>

              <p>
                Please check your email for a verification link.
              </p>

              <Link to="/" className="inline-block mt-4 button-base button-primary" title="Login">
                Continue
              </Link>
            </div>
          </div>
        )}
      </Portal>
    </div>
  );
}

export default SignUpPage;
