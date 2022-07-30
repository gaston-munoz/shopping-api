import { BadRequestException } from '@nestjs/common';
import { v4 as uuid } from 'uuid'

export const fileNamer = (req: Express.Request, file: Express.Multer.File, callback: Function) => {
    if (!file) {
        throw new BadRequestException('File not found')
    }

    const fileExtension = file.mimetype && file.mimetype.split('/')[1]
    
    const fileName = `${uuid()}.${fileExtension}`

    callback(null, fileName)
}