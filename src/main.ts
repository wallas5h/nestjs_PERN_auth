import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import * as cookieParser from "cookie-parser";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    })
  );
  app.setGlobalPrefix("api");
  app.use(cookieParser());
  await app.listen(3001);

  //for public authGuard (accessTokenGuard)
  // const reflector = new Reflector();
  // app.useGlobalGuards(new JwtAccessTokenAuthGuard(reflector));
}
bootstrap();
