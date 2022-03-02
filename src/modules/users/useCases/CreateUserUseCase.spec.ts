import { v4 as uuid } from "uuid";

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
  }): Promise<User>;
  findByUserCpf(cpf: string): Promise<User>;
  findByUserEmail(email: string): Promise<User>;
}

class User {
  id: string;
  name: string;
  cpf: string;
  phone: string;
  email: string;
  password: string;
  photo: string;
  agency: number;
  account: number;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}

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
}

class CreateUserUseCase {
  constructor(private usersRepository: IUsersRepository) {}
  async execute({ name, cpf, phone, email, password, photo }): Promise<User> {
    const userExists = await this.usersRepository.findByUserCpf(cpf);

    if (userExists) {
      throw new Error("User Already Exists!");
    }

    const userExistsEmail = await this.usersRepository.findByUserEmail(email);

    if (userExistsEmail) {
      throw new Error("User Already Exists!");
    }

    const agency = Math.random() * (9999 - 1) + 1;
    const account = Math.random() * (10 - 1) + 1;

    const user = this.usersRepository.create({
      name,
      cpf,
      phone,
      email,
      password,
      photo,
      agency,
      account,
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
  it("Should create a user, create agency and number account", async () => {
    const user = await createUserUseCase.execute({
      name: "Test User",
      cpf: "12312312309",
      email: "test@dev.com",
      password: "123",
      phone: "11987489504",
      photo: null,
    });

    expect(user).toHaveProperty("id");
    expect(user).toHaveProperty("agency");
    expect(user).toHaveProperty("account");
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

  it("Should not create user with email exists!", async () => {
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
        cpf: "12355543210",
        email: "test@dev.com",
        password: "123",
        phone: "11987489504",
        photo: null,
      });
    }).rejects.toEqual(new Error("User Already Exists!"));
  });
});
