import { v4 as uuid } from "uuid";

interface IUsersRepository {
  create({ name, cpf, phone, email, password, photo }): Promise<User>;
}

class User {
  id: string;
  name: string;
  cpf: string;
  phone: string;
  email: string;
  password: string;
  photo: string;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}

class UserRepositoryInMemory implements IUsersRepository {
  users: User[] = [];

  async create({ name, cpf, phone, email, password, photo }): Promise<User> {
    const user = new User();

    Object.assign(user, {
      name,
      cpf,
      phone,
      email,
      password,
      photo,
    });

    this.users.push(user);

    return user;
  }
}

class CreateUserUseCase {
  constructor(private usersRepository: IUsersRepository) {}
  async execute({ name, cpf, phone, email, password, photo }): Promise<User> {
    const user = this.usersRepository.create({
      name,
      cpf,
      phone,
      email,
      password,
      photo,
    });

    return user;
  }
}

describe("Create User", () => {
  it("Should create a user", async () => {
    const userRepositoryInMemory = new UserRepositoryInMemory();
    const createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);

    const user = await createUserUseCase.execute({
      name: "Test User",
      cpf: "12312312309",
      email: "test@dev.com",
      password: "123",
      phone: "11987489504",
      photo: null,
    });

    expect(user).toHaveProperty("id");
  });
});
