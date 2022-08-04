import { PassportStrategy } from '@nestjs/passport'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { JwtPayload } from '../interfaces/jwt-payload.interface'

import { User } from '../entities/user.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ConfigService } from '@nestjs/config'
import { Injectable, UnauthorizedException } from '@nestjs/common'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        private readonly configService: ConfigService,
    ) {
        super({
            secretOrKey: configService.get('jwtSecret'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        })
    }
    async validate(payload: JwtPayload): Promise<User>{
        const { id } = payload

        const user = await this.userRepository.findOne({ where: { id }})

        if (!user)
          throw new UnauthorizedException('Not Authorized to access this resource')
        
        if (!user.isActive)
          throw new UnauthorizedException(`User ${user.fullName} is not active`)

        return user
    }
}