import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, SetMetadata } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { AuthService } from './auth.service'
import { Auth } from './decorators/auth.decorator'
import { GetUser } from './decorators/get-user.decorator'
import { GetRawHeaders } from './decorators/raw-headers.decorator'
import { RoleProtected } from './decorators/role-protected.decorator'
import { CreateUserDto } from './dto/create-user.dto'
import { LoginUserDto } from './dto/login-user.dto'
import { User } from './entities/user.entity'
import { UserRoleGuard } from './guars/user-role.guard';
import { Role } from './interfaces/roles.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  create(@Body() createAuthDto: CreateUserDto) {
    return this.authService.create(createAuthDto)
  }

  @Post('login')
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
