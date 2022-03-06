import { UserRepositoryInMemory } from "../../repositories/in-memory/UserRepositoryInMemory";
import { CreateUserUseCase } from "./CreateUserUseCase";

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
