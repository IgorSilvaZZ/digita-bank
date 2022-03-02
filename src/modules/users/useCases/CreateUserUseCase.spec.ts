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
    date_birth,
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
  date_birth: Date;

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
}

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
      date_birth,
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
      password: "123456",
      phone: "11987489504",
      photo: null,
      date_birth: "2001-12-06",
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
      password: "123456",
      phone: "11987489504",
      photo: null,
      date_birth: "2001-12-06",
    });

    expect(async () => {
      await createUserUseCase.execute({
        name: "Test User",
        cpf: "12312312309",
        email: "test@dev.com",
        password: "123456",
        phone: "11987489504",
        photo: null,
        date_birth: "2001-12-06",
      });
    }).rejects.toEqual(new Error("User Already Exists!"));
  });

  it("Should not create user with email exists!", async () => {
    await createUserUseCase.execute({
      name: "Test User",
      cpf: "12312312309",
      email: "test@dev.com",
      password: "123456",
      phone: "11987489504",
      photo: null,
      date_birth: "2001-12-06",
    });

    expect(async () => {
      await createUserUseCase.execute({
        name: "Test User",
        cpf: "12355543210",
        email: "test@dev.com",
        password: "123456",
        phone: "11987489504",
        photo: null,
        date_birth: "2001-12-06",
      });
    }).rejects.toEqual(new Error("User Already Exists!"));
  });

  it("Should not create user age before 18", async () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "Test User",
        cpf: "12355543210",
        email: "test@dev.com",
        password: "123456",
        phone: "11987489504",
        photo: null,
        date_birth: "2005-10-10",
      });
    }).rejects.toEqual(new Error("Age for user is invalid!"));
  });

  it("Should not create user for passwor is invalid!", async () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "Test User",
        cpf: "12355543210",
        email: "test@dev.com",
        password: "123",
        phone: "11987489504",
        photo: null,
        date_birth: "2001-10-10",
      });
    }).rejects.toEqual(new Error("Password is invalid!"));
  });
});
