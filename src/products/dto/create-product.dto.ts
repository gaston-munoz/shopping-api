import { IsArray, IsIn, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator"
import { ApiProperty } from '@nestjs/swagger'
export class CreateProductDto {

    @ApiProperty({
        example: 'T-shirt',
        description: 'Product Title',
    })
    @IsString()
    @MinLength(3)
    title: string
    
    @ApiProperty({
        example: 'Awesome cloth',
        description: 'Product Description',
    })
    @IsString()
    @IsOptional()
    description?: string
    
    @ApiProperty({
        example: 100,
        description: 'Product Price',
    })
    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number

    @ApiProperty({
        example: 10,
        description: 'Product stock',
    })
    @IsNumber()
    @IsPositive()
    @IsOptional()
    stock?: number

    @ApiProperty({
        example: 't-shirt_awesome',
        description: 'Product Slug for SEO',
        uniqueItems: true,
    })
    @IsString()
    @IsOptional()
    slug?: string

    @ApiProperty({
        example: [ 'S', 'M' ],
        description: 'Product Sizes',
    })
    @IsArray()
    @IsString({ each: true })
    sizes: string[]

    @ApiProperty({
        example: 'men',
        description: 'Product Gender',
    })
    @IsIn(['men', 'women', 'unisex'])
    gender: string

    @ApiProperty({
        example: 'offer',
        description: 'Product Tags',
    })
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    tags?: string[]

    @ApiProperty({
        example: 'https://www.cloud.com/img.png',
        description: 'Product Images',
    })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    images: string[]
}
