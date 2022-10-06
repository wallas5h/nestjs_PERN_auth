import { BadRequestException, Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { PrismaService } from "prisma/prisma.service";
import { AuthDto } from "./dto/auth.dto";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

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

    // const data: Prisma.UserCreateInput = { email, hashedpassword };

    await this.prisma.user.create({
      data: {
        email,
        hashedpassword,
      },
    });

    return { message: "signup was succesfull" };
  }

  async login(user: AuthDto) {
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
