import { Request, Response } from "express";
import { CreateUserUseCase } from "./CreateUserUseCase";

class CreateUserController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  async handle(req: Request, res: Response) {
    const { name, cpf, phone, email, password, photo, date_birth } = req.body;

    const user = await this.createUserUseCase.execute({
      name,
      cpf,
      phone,
      email,
      password,
      photo,
      date_birth,
    });

    return res.status(201).json(user);
  }
}

export { CreateUserController };
