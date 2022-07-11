import { Router as ExpressRouter } from "express";
import { ApiKeyMiddleware, JWTMiddleware } from "../middlewares";
// Routes
import UserRoute from "./user-route";
import ActivityRoute from "./activity-route";

const Router = ExpressRouter();

Router.use("/user", ApiKeyMiddleware, UserRoute);
Router.use("/activity", ApiKeyMiddleware, JWTMiddleware, ActivityRoute);

export default Router;
