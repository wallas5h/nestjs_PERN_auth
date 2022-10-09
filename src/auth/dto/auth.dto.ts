import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class AuthDto {
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 20, {
    message: "Password has to be at between 3 and 20 characters",
  })
  public password: string;
}
