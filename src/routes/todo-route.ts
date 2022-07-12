import { Router as ExpressRouter } from "express";
import { TodoControllers } from "../controllers";

const Router = ExpressRouter();

Router.get("/", TodoControllers.getAllTodos);
Router.get("/single/:id", TodoControllers.getTodo);
Router.post("/", TodoControllers.createTodo);
Router.delete("/:id", TodoControllers.deleteTodo);
Router.put("/:id", TodoControllers.updateTodo);

export default Router;
