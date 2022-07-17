import { Logo } from "assets";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { LoginRequest } from "services";
import { useLoginMutation } from "services";
import { ReactNotyf } from "utils";

type FormStateType = LoginRequest;

type FormsType = {
  type: string;
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  pattern?: string;
  icon?: string;
}

function LoginPage() {
  const [formState, setFormState] = useState<FormStateType>({
    email: "",
    password: "",
  });

  const [login, { isLoading }] = useLoginMutation();

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const pattern = /^[a-zA-Z0-9.@!#$%&_-]*$/;
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

    await login(formState)
      .unwrap()
      .then((res) => {
        if (res.statusCode === 200) {
          ReactNotyf.success("Login Successful");
        }
      })
      .catch((error) => {
        const message = error.data?.message;

        if (message && message === "User not verified") {
          return ReactNotyf.error("Please verify your email first");
        }

        return ReactNotyf.error(error.data?.message ?? "Login Failed");
      });
  };

  const FormInput: FormsType[] = [
    {
      type: "email",
      value: formState.email,
      placeholder: "Email",
      onChange: handleOnChange,
    },
    {
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
            <h1 className="mb-4">Login</h1>
            <p className="mb-4">
              Hey! Welcome to the login page.
              please enter your credentials to login.
            </p>

            {FormInput.map(({
              type, placeholder, value, onChange,
            }) => (
              <div key={type} className="flex flex-col items-center mb-4 text-left">
                <label htmlFor={type} className="block w-full">{placeholder}</label>
                <input
                  type={type}
                  id={type}
                  name={type}
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
              title="Login"
            >
              {isLoading ? <span className="animate-pulse">...</span> : <span>Login</span>}
            </button>
          </form>

          <p className="mt-6">
            Don&apos;t have an account?
            {" "}
            <Link to="/signup" className="text-primary" title="Signup">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
