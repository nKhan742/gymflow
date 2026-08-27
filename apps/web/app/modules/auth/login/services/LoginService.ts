import { LoginApi } from '../api';

export class LoginService {
  static async getList() {
    return LoginApi.getAll();
  }
}
