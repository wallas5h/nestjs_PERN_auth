import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { GetPropCurrentUser } from "src/decorators/current-user.decorator";
import { CurrentUserId } from "src/decorators/current-userID.decorator";
import { Public } from "src/decorators/public.decorator";
import { AuthService } from "./auth.service";
import { AuthDto, RegisterDto } from "./dto/auth.dto";
import { JwtRefreshTokenAuthGuard } from "./guards/jwt-refreshToken.auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("signup")
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() createUser: RegisterDto) {
    return this.authService.signup(createUser);
  }

  @Public()
  @Post("login")
  @HttpCode(HttpStatus.OK)
  login(@Body() user: AuthDto, @Res() response, @Req() request) {
    return this.authService.login(user, request, response);
  }

  // @UseGuards(JwtAccessTokenAuthGuard)   // not nesessary with globalAccessToenGuard
  // @UseGuards(AuthGuard("jwt-access"))   zamiennie z powyższym
  @Post("logout")
  @HttpCode(HttpStatus.OK)
  logout(@Res() response, @CurrentUserId() id) {
    return this.authService.logout(id, response);
  }
  // logout(@Res() response, @Req() request) {
  //   const { id } = request.user;
  //   return this.authService.logout(id, response);
  // }

  @Public()
  @UseGuards(JwtRefreshTokenAuthGuard)
  // @UseGuards(AuthGuard("jwt-refresh"))   zamiennie z powyższym
  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @Res() response,
    @Req() request,
    @CurrentUserId() id,
    @GetPropCurrentUser("refreshToken") refreshToken
  ) {
    return this.authService.refreshTokens(id, refreshToken, response);
  }
  // refreshTokens(@Res() response, @Req() request) {
  //   const { id, refreshToken } = request.user;
  //   return this.authService.refreshTokens(id, refreshToken, response);
  // }
}
