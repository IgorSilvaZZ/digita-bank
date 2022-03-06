import { UsersRepository } from "../../infra/typeorm/repositories/UsersRepository";
import { CreateUserController } from "./CreateUserController";
import { CreateUserUseCase } from "./CreateUserUseCase";

export default (): CreateUserController => {
  const userRepository = new UsersRepository();

  const createUserUseCase = new CreateUserUseCase(userRepository);

  const createUserController = new CreateUserController(createUserUseCase);

  return createUserController;
};
