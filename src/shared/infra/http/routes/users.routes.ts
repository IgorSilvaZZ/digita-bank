import { Router } from "express";

import createUserController from "@modules/users/useCases";

const usersRouter = Router();

usersRouter.post("/", (req, res) => {
  return createUserController().handle(req, res);
});

export { usersRouter };
