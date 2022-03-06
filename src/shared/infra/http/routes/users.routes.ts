import { Router } from "express";

import createUserController from "@modules/users/useCases/createUsers";
import authenticateUserController from "@modules/users/useCases/authenticationUser";

const usersRouter = Router();

usersRouter.post("/", (req, res) => {
  return createUserController().handle(req, res);
});

usersRouter.post("/login", (req, res) => {
  return authenticateUserController().handle(req, res);
});

export { usersRouter };
