import { Body, Controller, Post, Req, Res } from "@nestjs/common";
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
  login(@Body() user: AuthDto, @Res() response, @Req() request) {
    this.authService.login(user, request, response);
  }

  @Post("logout")
  logout(@Res() response, @Req() request) {
    this.authService.logout(request, response);
  }

  @Post("refresh")
  refreshTokens(@Res() response, @Req() request) {
    this.authService.refreshTokens(request, response);
  }
}
