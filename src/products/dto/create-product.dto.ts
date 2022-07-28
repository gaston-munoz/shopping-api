import { IsArray, IsIn, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator"

export class CreateProductDto {
    @IsString()
    @MinLength(3)
    title: string
    
    @IsString()
    @IsOptional()
    description?: string
    
    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number

    @IsNumber()
    @IsPositive()
    @IsOptional()
    stock?: number

    @IsString()
    @IsOptional()
    slug?: string

    @IsArray()
    @IsString({ each: true })
    sizes: string[]

    @IsIn(['men', 'women', 'unisex'])
    gender: string
}
