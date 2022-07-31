import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from 'src/auth/entities/user.entity';
import { ProductsService } from 'src/products/products.service';

import { initialData } from './data/products.data'
import { users } from './data/users.data';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  private readonly productsData = initialData
  private readonly usersData = users

  constructor(
    private readonly productService: ProductsService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async executeSeed() {
    await this.deleteAllTables()
    const users =  await this.inertUsers()

    const { products } = this.productsData
    const insertProducts = products.map(product => this.productService.create(product, users[0]))

    await Promise.all(insertProducts)

    return {
      success: true,
      message: 'Seeded successfully',
      error: null,
    }
  }

  private async deleteAllTables() {
    try {
      await this.productService.deleteAll()

      await this.userRepository.createQueryBuilder()
        .delete()
        .where({})
        .execute()
    } catch (error) {
      throw new InternalServerErrorException(`Seed executed with a db error: ${error.detail}`)
    }
  }

  private async inertUsers(): Promise<User[]> {
    const prs = this.usersData.map(
      user => { 
        const userToCreate = this.userRepository.create(user)
        userToCreate.password = bcrypt.hashSync(userToCreate.password, 10)
        return this.userRepository.save(userToCreate)
      }
    )

    return Promise.all(prs)
  }

}
