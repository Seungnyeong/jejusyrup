import { IsEmail, IsJSON, IsNotEmpty, IsString } from 'class-validator';
import { Country } from 'src/interface/country.interface';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  nick_name: string;

  @IsString()
  password: string;

  @IsJSON()
  country: Country;

  @IsString()
  @IsNotEmpty()
  provider: string;
}
