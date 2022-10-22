import {
  IsBooleanString,
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
} from "class-validator";

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
export class RegisterDto {
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 20, {
    message: "Password has to be at between 3 and 20 characters",
  })
  public password: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 20, {
    message: "Name has to be at between 3 and 20 characters",
  })
  public name: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 20, {
    message: "Name has to be at between 3 and 20 characters",
  })
  public role: string;

  @IsNotEmpty()
  @IsBooleanString()
  public isActive: string;
}
