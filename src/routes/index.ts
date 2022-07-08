import { Router as ExpressRouter } from "express";
import { ApiKeyMiddleware } from "../middlewares";
// Routes
import UserRoute from "./user-route";

const Router = ExpressRouter();

Router.use("/user", ApiKeyMiddleware, UserRoute);

export default Router;
