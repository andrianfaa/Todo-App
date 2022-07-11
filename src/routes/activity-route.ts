import { Router as ExpressRouter } from "express";
import { ActivityControllers } from "../controllers";

const Router = ExpressRouter();

Router.get("/", ActivityControllers.getAll);
Router.post("/", ActivityControllers.create);
Router.delete("/:id", ActivityControllers.delete);
Router.put("/:id", ActivityControllers.update);

export default Router;
