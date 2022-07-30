import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { existsSync } from 'fs'
import { join } from 'path'

@Injectable()
export class FilesService {
  upload(file: Express.Multer.File) {
    return 'This action adds a new file'
  }

  getFileByPath(name: string) {
    const path = join(__dirname, '../../../static', name)
    if (!existsSync(path)) {
      throw new NotFoundException('File not found')
    }

    return path
  }
}
