import { IsEmail, IsNotEmpty, IsPhoneNumber, MinLength } from 'class-validator';

export class RegisterDto {
    @IsNotEmpty()
    name: string;

    @IsEmail()
    email: string;

    @IsPhoneNumber('PK')
    phoneNumber: string;

    @IsNotEmpty()
    companyName: string;

    @IsNotEmpty()
    companyUrl: string;

    @MinLength(6)
    password: string;
}
