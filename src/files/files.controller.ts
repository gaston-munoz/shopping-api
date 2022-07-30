import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { FilesService } from './files.service'
import { fileFilter } from 'src/files/utils/fileFilter.util'
import { diskStorage } from 'multer'

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter,
      storage: diskStorage({
        destination: './static/products'
      })
    }), 
  )
  uploadFile(@UploadedFile() file: Express.Multer.File, ) {
    if (!file) {
      throw new BadRequestException('The file is not allowed')
    }
    console.log({file})

    return this.filesService.upload(file)
  }
}
