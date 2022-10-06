import { Body, Controller, Get, Post, Req, Res } from "@nestjs/common";
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
  login(
    @Body() user: AuthDto,
    @Res({ passthrough: true }) response,
    @Req() request
  ) {
    return this.authService.login(user, request, response);
  }

  @Get("logout")
  logout(@Res({ passthrough: true }) response, @Req() request) {
    this.authService.logout(request, response);
  }
}
