import { Response } from 'express'
import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException, Get, Param, Res } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { FilesService } from './files.service'
import { fileFilter } from 'src/files/utils/fileFilter.util'
import { diskStorage } from 'multer'
import { fileNamer } from './utils/fileNamer.util';
import { ConfigService } from '@nestjs/config'
import { fileDestinator } from './utils/fileDestinationator.util'

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  @Get(':type/:name')
  getFile(
    @Res() res: Response,
    @Param('type') type: string,
    @Param('name') name: string,
  ) {
    const relPath = `/${type}/${name}`;
    const path = this.filesService.getFileByPath(relPath)

    res.sendFile(path) 
  }

  @Post('upload/:type')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter,
      storage: diskStorage({
        destination: fileDestinator,
        filename: fileNamer,
      })
    }), 
  )
  uploadFile(
    @UploadedFile() file: Express.Multer.File, 
    @Param('type') type: string,
  ) {
    if (!file) {
      throw new BadRequestException('The file is not allowed')
    }

    const secureUrl = `${this.configService.get('apiHost')}/files/${type}/${file.filename}`

    return {
      success: true,
      secureUrl,
      error: null,
    }
  }
}
