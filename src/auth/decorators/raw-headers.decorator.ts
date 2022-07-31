import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common';

export const GetRawHeaders = createParamDecorator ((data: string, ctx: ExecutionContext) => {

    const { rawHeaders } = ctx.switchToHttp().getRequest()

    return rawHeaders
})