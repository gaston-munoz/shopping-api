import { Product } from "src/products/entities/product.entity"
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column('text', {
        unique: true,
    })
    email: string

    @Column('text', {
        select: false
    })
    password: string

    @Column('text')
    fullName: string

    @Column('text', {
        array: true,
        default: [ 'user' ],
    })
    roles: string[]

    @Column('boolean', { default: true })
    isActive: boolean

    @OneToMany(
        () => Product,
        (product) => product.user,
    )
    product: Product[]
}
