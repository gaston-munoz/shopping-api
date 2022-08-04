import { IsEmail, IsString, Matches, MinLength } from "class-validator"
import { ApiProperty } from '@nestjs/swagger'

export class CreateUserDto {
    @IsString()
    @IsEmail()
    @ApiProperty({
        example: 'test@gmail.com',
        description: 'User Email',
        uniqueItems: true,
    })
    email: string

    @IsString()
    @MinLength(3)
    @ApiProperty({
        example: 'Roy Jhones',
        description: 'User Fullname',
    })
    fullName: string

    @IsString()
    @MinLength(4)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    @ApiProperty({
        example: 'password',
        description: 'User Password',
    })
    password: string
}
