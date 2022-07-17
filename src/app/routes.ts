import { ReactNode } from "react";
// Pages
import LoginPage from "pages/loginPage";
import SignUpPage from "pages/signupPage";
import VerifyEmailPage from "pages/verifyEmailPage";

export interface RouteType {
  path: string;
  name?: string;
  isPrivate?: boolean;
  // element: ReactNode;
  element: () => JSX.Element;
}

const PublicRoute: RouteType[] = [
  {
    path: "/",
    name: "Login",
    element: LoginPage,
  },
  {
    path: "/signup",
    name: "Sign Up",
    element: SignUpPage,
  },
  {
    path: "/verify-email",
    name: "Verify Email",
    element: VerifyEmailPage,
  },
];

const PrivateRoute: RouteType[] = [];

export { PublicRoute, PrivateRoute };
