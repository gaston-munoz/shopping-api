import {
  Controller,
  Post,
  Body,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ApiResponse } from '@nestjs/swagger'

import { AuthService } from './auth.service'
import { Auth } from './decorators/auth.decorator'
import { GetUser } from './decorators/get-user.decorator'
import { CreateUserDto } from './dto/create-user.dto'
import { LoginUserDto } from './dto/login-user.dto'
import { User } from './entities/user.entity'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  @ApiResponse({ status: 201, description: 'User register', type: User })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  create(@Body() createAuthDto: CreateUserDto) {
    return this.authService.create(createAuthDto)
  }

  @Post('login')
  @ApiResponse({ status: 201, description: 'User logged', type: User })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @ApiResponse({ status: 403, description: 'Invalid credentials' })
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.loginUser(loginUserDto)
  }

  @Post('check-auth-status')
  @Auth()
  checkAuthStatus(
    @GetUser() user: User
  ) {
    return this.authService.checkToken(user)
  }
}
