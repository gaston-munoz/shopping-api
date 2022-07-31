import { Injectable, BadRequestException, InternalServerErrorException, Post, Body, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { JwtService } from '@nestjs/jwt'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'

import { LoginUserDto } from './dto/login-user.dto'
import { CreateUserDto } from './dto/create-user.dto'
import { User } from './entities/user.entity'
import { JwtPayload } from './interfaces/jwt-payload.interface'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      createUserDto.password = bcrypt.hashSync(createUserDto.password, 10)
      const user = this.userRepository.create(createUserDto)

      await this.userRepository.save(user)
      delete user.password

      return {
        ...user,
        token: this.generateJwt({ id: user.id })
      }
    } catch (error) {
      this.handleDBError(error)
    }
  }

  async loginUser(@Body() userLoginDto: LoginUserDto) {
    const { password, email } = userLoginDto

    const user = await this.userRepository.findOne({
      where: { email },
      select: { id: true, email: true, password: true, fullName: true },
    })

    if(!user)
      throw new UnauthorizedException('Email or password incorrect')

    if (!user.isActive)
      throw new UnauthorizedException(`User ${user.fullName} is not active`)

    if(!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Email or password incorrect')
  
    return {
      ...user,
      token: this.generateJwt({ id: user.id })
    }
  }

  private handleDBError(error: any): never {
    if (error.code === '23505')
      throw new BadRequestException(error.detail)

    console.log(error)

    throw new InternalServerErrorException('Error saving user')
  }

  private generateJwt(payload: JwtPayload) {
    const token = this.jwtService.sign(payload)

    return token
  }
}
