import { Request, Response } from "express";

import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

class AuthenticateUserController {
  constructor(private authenticateUserUseCase: AuthenticateUserUseCase) {}

  async handle(req: Request, res: Response) {
    const { agency, account, password } = req.body;

    const user = await this.authenticateUserUseCase.execute({
      agency,
      account,
      password,
    });

    return res.json(user);
  }
}

export { AuthenticateUserController };
