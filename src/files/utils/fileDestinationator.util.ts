import { Request } from 'express'
import { BadRequestException } from '@nestjs/common';
import { v4 as uuid } from 'uuid'

export const fileDestinator = (req: Request, file: Express.Multer.File, callback: Function) => {
    if (!file) {
        throw new BadRequestException('File not provide')
    }

    const folder = req.params.type ?? 'public'    
    callback(null, `./static/${folder}`)
}