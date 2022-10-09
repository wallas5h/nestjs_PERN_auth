import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Request } from "express";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getOne(id: string, req: Request) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException("no user");
    }

    const decodedUser = req.user as { id: string; email: string };

    if (user.id !== decodedUser.id) {
      throw new ForbiddenException("Invalid credentials");
    }

    return { email: (await user).email, id: (await user).id };
  }

  getAllUsers() {
    return this.prisma.user.findMany({
      select: { id: true, email: true },
    });
  }
}
