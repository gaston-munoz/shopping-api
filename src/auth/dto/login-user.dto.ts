import { IsEmail, IsString, Matches, MinLength } from "class-validator"

export class LoginUserDto {
    @IsString()
    @IsEmail()
    email: string

    @IsString()
    @MinLength(4)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string
}
