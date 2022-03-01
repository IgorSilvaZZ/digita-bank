import { v4 as uuid } from "uuid";

interface IUsersRepository {
  create({ name, cpf, phone, email, password, photo }): Promise<User>;
  findByUserCpf(cpf: string): Promise<User>;
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

  async findByUserCpf(cpf: string): Promise<User> {
    return this.users.find((user) => user.cpf === cpf);
  }
}

class CreateUserUseCase {
  constructor(private usersRepository: IUsersRepository) {}
  async execute({ name, cpf, phone, email, password, photo }): Promise<User> {
    const userExists = await this.usersRepository.findByUserCpf(cpf);

    if (userExists) {
      throw new Error("User Already Exists!");
    }

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

let usersRepositoryInMemory: UserRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;

describe("Create a User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UserRepositoryInMemory();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });
  it("Should create a user", async () => {
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

  it("Should not create user with cpf exists!", async () => {
    await createUserUseCase.execute({
      name: "Test User",
      cpf: "12312312309",
      email: "test@dev.com",
      password: "123",
      phone: "11987489504",
      photo: null,
    });

    expect(async () => {
      await createUserUseCase.execute({
        name: "Test User",
        cpf: "12312312309",
        email: "test@dev.com",
        password: "123",
        phone: "11987489504",
        photo: null,
      });
    }).rejects.toEqual(new Error("User Already Exists!"));
  });
});
