import { UserRepositoryInMemory } from "@modules/users/repositories/in-memory/UserRepositoryInMemory";
import { CreateUserUseCase } from "../createUsers/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let usersRepositoryInMemory: UserRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("Authentication User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UserRepositoryInMemory();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepositoryInMemory
    );
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
      password: user.password,
    };

    const result = await authenticateUserUseCase.execute(userRequest);

    expect(result).toHaveProperty("token");
  });

  it("Should not able to authenticate an nonexistent user", async () => {
    const userRequest = {
      agency: "0111223",
      account: "1",
      password: "123",
    };

    expect(async () => {
      await authenticateUserUseCase.execute(userRequest);
    }).rejects.toEqual(new Error("Agency/Account or Password is incorrect!"));
  });
});
