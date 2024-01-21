import { IsEmail, IsEnum, IsJSON, IsNotEmpty, IsString } from 'class-validator';
import { UserProvider } from 'src/apis/users/entities/user.entity';
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
}
