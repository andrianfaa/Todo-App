import { Router as ExpressRouter } from "express";
import { UserControllers } from "../controllers";
import { JWTMiddleware } from "../middlewares";

const Router = ExpressRouter();

Router.post("/signup", UserControllers.signup);
Router.post("/login", UserControllers.login);
Router.get("/verify-email", UserControllers.verify);
Router.get("/info", JWTMiddleware, UserControllers.getUser);

export default Router;
