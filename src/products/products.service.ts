import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { Product } from './entities/product.entity'
import { PaginationDto } from '../common/dto/pagination.dto';
import { validate as isUUID } from 'uuid'
import { ProductImage } from './entities/productImage.entity'

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService')

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource
  ){}

  async create(createProductDto: CreateProductDto) {
    const { images = [], ...productToSave } = createProductDto
    try {
      const product = this.productRepository.create({
        ...productToSave,
        images: images.map(url => this.productImageRepository.create({ url }))
      })
      const savedProduct = await this.productRepository.save(product)
  
      return savedProduct
    } catch (error) {
      this.handleDBError(error)
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto

    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: { images: true }
    })

    return products.map(product => this.plainProduct(product))
  }

  async findOne(search: string) {
    let product: Product

    if (isUUID(search)) {
      product = await this.productRepository.findOneBy({ id: search })
    } else {
      const query = this.productRepository.createQueryBuilder('prod')
      product = await query
        .where('title ILIKE :search OR slug ILIKE :search', {
          search
        })
        .leftJoinAndSelect('prod.images', 'pi')
        .getOne()
    }

    if (!product) throw new NotFoundException(`The product with search ${search} not found`)

    return this.plainProduct(product)
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { images, ...product } = updateProductDto
    let productToUpdate: Product

    const productDB = await this.productRepository.preload({
      id,
      ...product,
    })

    if (!productDB) throw new NotFoundException(`The product with id ${id} not found`)

    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      if (images) {
        await queryRunner.manager.delete(ProductImage, { product: { id } })

        productDB.images = images.map(url => this.productImageRepository.create({ url }))
      }

      await queryRunner.manager.save(productDB)
      await queryRunner.commitTransaction()
      await queryRunner.release()

      const productSaved = await this.findOne(id)
      return productSaved
    } catch (error) {
      await queryRunner.rollbackTransaction()
      await queryRunner.release()

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

  private plainProduct(product: Product) {
    return {
      ...product,
      images: product.images.map(({ url }) => url)
    }
  }


  async deleteAll() {
    const query = this.productRepository.createQueryBuilder('product')

    try {
      const result = await query
        .delete()
        .where({})
        .execute()

        return result
    } catch (error) {
      this.handleDBError(error)
    }
  }
}
