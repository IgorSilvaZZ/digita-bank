import { hash } from "bcryptjs";

import { User } from "@modules/users/infra/typeorm/entities/User";
import { IUsersRepository } from "../repositories/IUsersRepository";
class CreateUserUseCase {
  constructor(private usersRepository: IUsersRepository) {}
  async execute({
    name,
    cpf,
    phone,
    email,
    password,
    photo,
    date_birth,
  }): Promise<User> {
    const userExists = await this.usersRepository.findByUserCpf(cpf);

    if (userExists) {
      throw new Error("User Already Exists!");
    }

    const userExistsEmail = await this.usersRepository.findByUserEmail(email);

    if (userExistsEmail) {
      throw new Error("User Already Exists!");
    }

    const nowDate = Number(new Date().getFullYear());

    const dateParsed = Number(new Date(date_birth).getFullYear());

    const userAgeIsInvalid = nowDate - dateParsed < 18;

    if (userAgeIsInvalid) {
      throw Error("Age for user is invalid!");
    }

    if (password.length < 6) {
      throw Error("Password is invalid!");
    }

    const passwordHash = await hash(password, 8);

    const agency = Math.random() * (9999 - 1) + 1;
    const account = Math.random() * (10 - 1) + 1;

    const user = this.usersRepository.create({
      name,
      cpf,
      phone,
      email,
      password: passwordHash,
      photo,
      agency,
      account,
      date_birth,
    });

    return user;
  }
}

export { CreateUserUseCase };
