import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { PrismaModule } from "prisma/prisma.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { JwtAccessTokenAuthGuard } from "./auth/guards/jwt-accessToken.auth.guard";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [AuthModule, PrismaModule, UsersModule],
  controllers: [AppController],
  providers: [
    AppService,

    //for global accessTokenGuard
    {
      provide: APP_GUARD,
      useClass: JwtAccessTokenAuthGuard,
    },
  ],
})
export class AppModule {}
