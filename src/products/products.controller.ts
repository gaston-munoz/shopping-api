import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, Query, Redirect } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { ProductsService } from './products.service'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { ParseUUIDPipe } from '@nestjs/common'
import { PaginationDto } from '../common/dto/pagination.dto';
import { Auth } from 'src/auth/decorators/auth.decorator'
import { GetUser } from 'src/auth/decorators/get-user.decorator'
import { User } from '../auth/entities/user.entity';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Auth()
  create(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user: User
    ) {
    return this.productsService.create(createProductDto, user)
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto)
  }

  @Get(':search')
  async findOne(@Param('search') search: string) {
    const product = await this.productsService.findOne(search)
    if (!product) throw new NotFoundException(`The product with search ${search} not exists`)
    
    return product
  }

  @Auth()
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User,
  ) {
    return this.productsService.update(id, updateProductDto, user)
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.productsService.remove(id)
    if (!result.affected) throw new NotFoundException(`The product with id ${id} not exists`)

    return {
      success: true,
      message: 'Product deleted',
    }
  }
}
