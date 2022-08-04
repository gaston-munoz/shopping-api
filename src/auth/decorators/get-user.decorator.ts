import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common';

export const GetUser = createParamDecorator ((data, ctx: ExecutionContext) => {
    const user = ctx.switchToHttp().getRequest().user
    if (!user) 
        throw new InternalServerErrorException('User not provide')

    if (data) {
        return user[data]
    }

    return user
})