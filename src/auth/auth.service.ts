import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { config } from "config/config";
import { Request, Response } from "express";
import { PrismaService } from "prisma/prisma.service";
import { AuthDto } from "./dto/auth.dto";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async signup(createUser: AuthDto) {
    const { email, password } = createUser;

    const founduser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (founduser) {
      throw new BadRequestException("Email already exist");
    }

    const salt = await bcrypt.genSalt();
    const hashedpassword = await bcrypt.hash(password, salt);

    await this.prisma.user.create({
      data: {
        email,
        hashedpassword,
      },
    });

    return { message: "signup was succesfull" };
  }

  async login(user: AuthDto, req: Request, res: Response) {
    const { email, password } = user;

    const foundUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!foundUser) {
      throw new BadRequestException("Wrong credentials");
    }

    const isMatch = await bcrypt.compare(password, foundUser.hashedpassword);

    if (!isMatch) {
      throw new BadRequestException("Wrong credentials");
    }

    const token = await this.signToken({
      id: foundUser.id,
      email: foundUser.email,
    });

    if (!token) {
      throw new ForbiddenException("Invalid token");
    }

    const expires = new Date(Date.now() + config.JWT_EXPIRATION_TIME * 1000);

    res.cookie("Authentication", token, {
      httpOnly: true,
      expires,
    });

    return res.send({
      message: "Logged success",
    });
  }

  async logout(req: Request, res: Response) {
    res.clearCookie("Authentication");
    return res.send({
      message: "Logout success",
    });
  }

  async signToken(payload: { id: string; email: string }) {
    return this.jwt.signAsync(payload, { secret: config.JWT_SECRET });
  }
}
