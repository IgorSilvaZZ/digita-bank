import { UserRepositoryInMemory } from "@modules/users/repositories/in-memory/UserRepositoryInMemory";
import { AppErrors } from "@shared/errors/AppErrors";
import { CreateUserUseCase } from "../createUsers/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let usersRepositoryInMemory: UserRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("Authentication User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UserRepositoryInMemory();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepositoryInMemory
    );
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("Should be ale to authenticate an user", async () => {
    const user = await createUserUseCase.execute({
      name: "Test User",
      cpf: "12312312309",
      email: "test@dev.com",
      password: "123456",
      phone: "11987489504",
      photo: null,
      date_birth: "2001-12-06",
    });

    const userRequest = {
      agency: user.agency,
      account: user.account,
      password: "123456",
    };

    const result = await authenticateUserUseCase.execute(userRequest);

    expect(result).toHaveProperty("token");
  });

  it("Should not able to authenticate an nonexistent user", async () => {
    expect(async () => {
      const userRequest = {
        agency: "0111223",
        account: "1",
        password: "123456",
      };
      await authenticateUserUseCase.execute(userRequest);
    }).rejects.toEqual(
      new AppErrors("Agency/Account or Password is incorrect!")
    );
  });

  it("Should not ble able to authenticate with incorrect password", () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: "Test User 2",
        cpf: "12312312301",
        email: "test2@dev.com",
        password: "123456",
        phone: "11987489504",
        photo: null,
        date_birth: "2001-12-06",
      });

      const userRequest = {
        agency: user.agency,
        account: user.account,
        password: "passwordIncorrect",
      };

      await authenticateUserUseCase.execute(userRequest);
    }).rejects.toEqual(
      new AppErrors("Agency/Account or Password is incorrect!")
    );
  });

  it("Should not ble able to authenticate with incorrect agency", async () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: "Test User 3",
        cpf: "12312312303",
        email: "test3@dev.com",
        password: "123456",
        phone: "11987489504",
        photo: null,
        date_birth: "2001-12-06",
      });

      const userRequest = {
        agency: "agencyIncorrect",
        account: user.account,
        password: "123456",
      };

      await authenticateUserUseCase.execute(userRequest);
    }).rejects.toEqual(
      new AppErrors("Agency/Account or Password is incorrect!")
    );
  });

  it("Should not ble able to authenticate with incorrect account", async () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: "Test User 4",
        cpf: "12312312304",
        email: "test4@dev.com",
        password: "123456",
        phone: "11987489504",
        photo: null,
        date_birth: "2001-12-06",
      });

      const userRequest = {
        agency: user.agency,
        account: "incorrectAgency",
        password: "123456",
      };

      await authenticateUserUseCase.execute(userRequest);
    }).rejects.toEqual(
      new AppErrors("Agency/Account or Password is incorrect!")
    );
  });
});
