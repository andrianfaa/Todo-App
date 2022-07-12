import { Router as ExpressRouter } from "express";
import { ApiKeyMiddleware, JWTMiddleware } from "../middlewares";
// Routes
import UserRoute from "./user-route";
import ActivityRoute from "./activity-route";
import TodoRoute from "./todo-route";

const Router = ExpressRouter();

Router.use("/user", ApiKeyMiddleware, UserRoute);
Router.use("/activity", ApiKeyMiddleware, JWTMiddleware, ActivityRoute);
Router.use("/todo", ApiKeyMiddleware, JWTMiddleware, TodoRoute);

export default Router;
