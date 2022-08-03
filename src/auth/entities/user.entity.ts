import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { ApiProperty } from '@nestjs/swagger'
import { Product } from "src/products/entities/product.entity"

@Entity('users')
export class User {
    
    @ApiProperty({ 
        example: '439c9809-1e8b-471d-bb98-943d1d93e5f8',
        description: 'User ID',
        uniqueItems: true,
    })
    @PrimaryGeneratedColumn('uuid')
    id: string

    @ApiProperty({ 
        example: 'mocking@gmail.com',
        description: 'User email',
        uniqueItems: true,
    })
    @Column('text', {
        unique: true,
    })
    email: string

    @Column('text', {
        select: false
    })
    password: string

    @ApiProperty({
        example: 'Roy Jhones',
        description: 'User name',
    })
    @Column('text')
    fullName: string

    @ApiProperty({
        example: ['user'],
        description: 'User roles',
    })
    @Column('text', {
        array: true,
        default: [ 'user' ],
    })
    roles: string[]

    @ApiProperty({
        example: true,
        description: 'User active',
    })
    @Column('boolean', { default: true })
    isActive: boolean

    @OneToMany(
        () => Product,
        (product) => product.user,
    )
    product: Product[]
}
