import { useState } from "react";

type FormStateType = {
  email: string;
  password: string;
}

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

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formState);
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
    <div className="container min-h-screen mx-auto p-6 text-center flex items-center justify-center">
      <form onSubmit={handleOnSubmit}>
        <h1>Login</h1>
        <p>
          Hey! Welcome to the login page.
          please enter your credentials to login.
        </p>

        {FormInput.map((input) => (
          <div key={input.type} className="flex flex-col items-center">
            <label htmlFor={input.type}>{input.placeholder}</label>
            <input
              type={input.type}
              id={input.type}
              name={input.type}
              value={input.value}
              onChange={input.onChange}
              className="text-black"
              required
            />
            {input.icon && <i className={`fas fa-${input.icon}`} />}
          </div>
        ))}

        <button type="submit">
          <span>Login</span>
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
