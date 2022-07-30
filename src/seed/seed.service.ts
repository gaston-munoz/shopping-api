import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/products.data'

@Injectable()
export class SeedService {
  private readonly productsData = initialData

  constructor(
    private readonly productService: ProductsService
  ) {}

  async executeSeed() {
    await this.productService.deleteAll()

    const { products } = this.productsData

    const insertProducts = products.map(product => this.productService.create(product))

    await Promise.all(insertProducts)

    return {
      success: true,
      message: 'Seeded successfully',
      error: null,
    }
  }

}
