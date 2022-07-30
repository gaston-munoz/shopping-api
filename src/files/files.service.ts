import { Injectable } from '@nestjs/common'

@Injectable()
export class FilesService {
  upload(file: Express.Multer.File) {
    return 'This action adds a new file'
  }
}
