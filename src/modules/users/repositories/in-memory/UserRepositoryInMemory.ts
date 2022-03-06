import { User } from "@modules/users/infra/typeorm/entities/User";
import { IUsersRepository } from "../IUsersRepository";

class UserRepositoryInMemory implements IUsersRepository {
  users: User[] = [];

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
    const user = new User();

    Object.assign(user, {
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

    this.users.push(user);

    return user;
  }

  async findByUserCpf(cpf: string): Promise<User> {
    return this.users.find((user) => user.cpf === cpf);
  }

  async findByUserEmail(email: string): Promise<User> {
    return this.users.find((user) => user.email === email);
  }

  async findByUserAccount({ agency, account }): Promise<User> {
    return this.users.find(
      (user) => user.agency === agency && user.account === account
    );
  }
}

export { UserRepositoryInMemory };
