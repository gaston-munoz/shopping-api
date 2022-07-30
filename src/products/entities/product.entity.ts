import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from './productImage.entity';

@Entity()
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column('text', {
        unique: true,
    })
    title: string

    @Column('text', {
        nullable: true,
    })
    description: string

    @Column('float', {
        default: 0,
    })
    price: number

    @Column('int', {
        default: 0,
    })
    stock: number

    @Column('text', {
        unique: true,
    })
    slug: string

    @Column('text', {
        array: true,
    })
    sizes: string[]

    @Column('text')
    gender: string

    @Column('text', {
        array: true,
        default: [],
    })
    tags: string[]

    @OneToMany(
        () => ProductImage,
        productImage => productImage.product,
        { 
            cascade: true,
            eager: true,
        },
    )
    images: ProductImage[]

    @BeforeInsert()
    checkSlugInsert() {
        this.checkSlug()
    }

    @BeforeUpdate()
    checkSlugUpdate() {
        this.checkSlug()
    }

    private checkSlug() {
        if (!this.slug) {
            this.slug = this.title
        }

        this.slug = this.slug.toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '') //TODO: Better this 
    }
}
