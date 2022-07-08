import { Router as ExpressRouter } from "express";
import { UserControllers } from "../controllers";

const Router = ExpressRouter();

Router.post("/signup", UserControllers.signup);
Router.post("/login", UserControllers.login);
Router.get("/verify-email", UserControllers.verify);

export default Router;
