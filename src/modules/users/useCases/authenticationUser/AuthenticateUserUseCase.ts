import { sign } from "jsonwebtoken";

import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { secret } from "@config/auth";

interface IResponseToken {
  token: string;
  user: {
    name: string;
    email: string;
    cpf: string;
    phone: string;
    photo: string;
    agency: number;
    account: number;
    date_birth: Date;
  };
}

class AuthenticateUserUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({ agency, account, password }) {
    const user = await this.usersRepository.findByUserAccount({
      agency,
      account,
      password,
    });

    if (!user) {
      throw new Error("Agency/Account or Password is incorrect!");
    }

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn: "1d",
    });

    const tokenReturn: IResponseToken = {
      token,
      user: {
        name: user.name,
        email: user.email,
        cpf: user.cpf,
        phone: user.phone,
        photo: user.photo,
        agency: user.agency,
        account: user.account,
        date_birth: user.date_birth,
      },
    };

    return tokenReturn;
  }
}

export { AuthenticateUserUseCase };
