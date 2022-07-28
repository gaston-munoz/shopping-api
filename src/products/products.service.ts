import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { Product } from './entities/product.entity'
import { PaginationDto } from '../common/dto/pagination.dto';
import { validate as isUUID } from 'uuid'

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService')

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ){}

  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.productRepository.create(createProductDto)
      const savedProduct = await this.productRepository.save(product)
  
      return savedProduct
    } catch (error) {
      this.handleDBError(error)
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto
    return this.productRepository.find({
      take: limit,
      skip: offset,
    })
  }

  async findOne(search: string) {
    let product: Product

    if (isUUID(search)) {
      product = await this.productRepository.findOneBy({ id: search })
    } else {
      const query = this.productRepository.createQueryBuilder()
      product = await query
        .where('title ILIKE :search OR slug ILIKE :search', {
          search
        }).getOne()
    }

    if (!product) throw new NotFoundException(`The product with search ${search} not found`)

    return product
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const productDB = await this.productRepository.preload({
      id,
      ...updateProductDto,
    })

    if (!productDB) throw new NotFoundException(`The product with id ${id} not found`)

    try {
      const productSaved = await this.productRepository.save(productDB)
      return productSaved
    } catch (error) {
      this.handleDBError(error)
    }
  }

  remove(id: string) {
    return this.productRepository.delete(id)
  }

  private handleDBError(error) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail)
    }

    this.logger.error(error)
    throw new InternalServerErrorException('Something went wrong')
  }
}
