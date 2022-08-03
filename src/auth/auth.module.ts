import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PassportModule } from '@nestjs/passport'

import { AuthController } from './auth.controller'
import { User } from './entities/user.entity'
import { AuthService } from './auth.service'
import { JwtStrategy } from './strategies/jwt.strategy';


@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([ User ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService,],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.getOrThrow('jwtSecret'),
          signOptions: {
            expiresIn: '1d'
          }
        }
      }
    })


    // JwtModule.register({
    //   secret: process.env.JWT_SECRET,
    //   signOptions: {
    //     expiresIn: '1d'
    //   }
    // })
  ],
  exports: [ TypeOrmModule, JwtStrategy, PassportModule, JwtModule ],
})
export class AuthModule {}
