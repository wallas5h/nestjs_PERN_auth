import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto/auth.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  signup(@Body() createUser: AuthDto) {
    return this.authService.signup(createUser);
  }

  @Post("login")
  login(@Body() user: AuthDto) {
    this.authService.login(user);
  }

  @Post("logout")
  logout() {
    this.authService.logout();
  }
}
