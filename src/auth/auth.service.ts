import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthService {
  async signup() {
    return {
      message: "signup was ok",
    };
  }

  async login() {
    return {
      message: "login ok",
    };
  }
  async logout() {
    return {
      message: "logout ok",
    };
  }
}
