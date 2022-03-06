import { User } from "@modules/users/infra/typeorm/entities/User";

interface IUsersRepository {
  create({
    name,
    cpf,
    phone,
    email,
    password,
    photo,
    agency,
    account,
    date_birth,
  }): Promise<User>;
  findByUserCpf(cpf: string): Promise<User>;
  findByUserEmail(email: string): Promise<User>;
  findByUserAccount({ agency, account }): Promise<User>;
}

export { IUsersRepository };
