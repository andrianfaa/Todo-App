import LoginPage from "pages/loginPage";

export interface RouteType {
  path: string;
  name?: string;
  isPrivate?: boolean;
  element: () => JSX.Element;
}

const PublicRoute: RouteType[] = [
  {
    path: "/",
    name: "Login",
    element: LoginPage,
  },
];

const PrivateRoute: RouteType[] = [];

export { PublicRoute, PrivateRoute };
