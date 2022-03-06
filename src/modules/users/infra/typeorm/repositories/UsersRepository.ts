import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { getRepository, Repository } from "typeorm";
import { User } from "../entities/User";

class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async create({
    name,
    cpf,
    phone,
    email,
    password,
    photo,
    agency,
    account,
    date_birth,
  }): Promise<User> {
    const user = this.repository.create({
      name,
      cpf,
      phone,
      email,
      password,
      photo,
      agency,
      account,
      date_birth,
    });

    await this.repository.save(user);

    return user;
  }
  async findByUserCpf(cpf: string): Promise<User> {
    const user = await this.repository.findOne({ cpf });

    return user;
  }
  async findByUserEmail(email: string): Promise<User> {
    const user = await this.repository.findOne({ email });

    return user;
  }
}

export { UsersRepository };
