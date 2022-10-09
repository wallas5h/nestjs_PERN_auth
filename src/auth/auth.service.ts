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

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

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

    const newUser = await this.prisma.user.create({
      data: {
        email,
        hashedpassword,
      },
    });

    const tokens = await this.getTokens({
      id: newUser.id,
      email: newUser.email,
    });

    await this.updateRtHash(newUser.id, tokens.refreshtoken);

    return tokens;
  }

  async login(user: AuthDto, req: Request, res: Response) {
    try {
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

      const cookieToken = await this.signToken({
        id: foundUser.id,
        email: foundUser.email,
      });

      if (!cookieToken) {
        throw new ForbiddenException("Invalid token");
      }

      const expires = new Date(Date.now() + config.JWT_EXPIRATION_TIME * 1000);

      res.cookie("Authentication", cookieToken, {
        // secure: true,
        httpOnly: true,
        expires,
      });

      const tokens = await this.getTokens({
        id: foundUser.id,
        email: foundUser.email,
      });

      await this.updateRtHash(foundUser.id, tokens.refreshtoken);

      return res.json({ tokens });
    } catch (e) {
      return res.json({ error: e.message });
    }
  }

  async logout(id, res: Response) {
    res.clearCookie("Authentication");

    await this.deleteRtHash(id);

    return res.send({
      message: "Logout success",
    });
  }

  async refreshTokens(id: string, refreshToken: string, res: Response) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user || !user.hashedRt) {
      throw new ForbiddenException("Access Denied1");
    }

    const isRtMatch = await bcrypt.compare(refreshToken, user.hashedRt);

    if (!isRtMatch) {
      throw new ForbiddenException("Access Denied2");
    }

    const tokens = await this.getTokens({
      id: user.id,
      email: user.email,
    });

    await this.updateRtHash(user.id, tokens.refreshtoken);

    return res.json({ tokens });
  }

  async updateRtHash(id: string, rt: string) {
    const hash = await this.hashData(rt);

    await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        hashedRt: hash,
      },
    });
  }

  async deleteRtHash(id: string) {
    await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        hashedRt: null,
      },
    });
  }

  async getTokens(payload: { id: string; email: string }) {
    const [accessToken, refreshtoken] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: config.ACCESS_TOKEN_SECRET,
        expiresIn: 60 * 15,
      }),
      this.jwt.signAsync(payload, {
        secret: config.REFRESH_TOKEN_SECRET,
        expiresIn: 60 * 60 * 24 * 7,
      }),
    ]);

    return {
      accessToken,
      refreshtoken,
    };
  }

  async signToken(payload: { id: string; email: string }) {
    const token = await this.jwt.signAsync(payload, {
      secret: config.JWT_SECRET,
    });

    return token;
  }
}
