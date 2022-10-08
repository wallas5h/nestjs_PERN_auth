import { Controller, Get, Param, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get("/:id")
  getMyUser(@Param() params: { id: string }, @Req() req) {
    return this.usersService.getOne(params.id, req);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getUsers() {
    return this.usersService.getAllUsers();
  }
}
