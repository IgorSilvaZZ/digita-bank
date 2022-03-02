import { v4 as uuid } from "uuid";

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

export { User };
