import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty, IsOptional, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product name',
    example: 'Laptop',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Product price',
    example: 999.99,
    minimum: 0,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'Product stock quantity',
    example: 50,
    minimum: 0,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  stock: number;
}

export class UpdateProductDto {
  @ApiProperty({
    description: 'Product name',
    example: 'Updated Laptop',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Product price',
    example: 899.99,
    minimum: 0,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  price?: number;

  @ApiProperty({
    description: 'Product stock quantity',
    example: 75,
    minimum: 0,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  stock?: number;
}

export class UpdateInventoryDto {
  @ApiProperty({
    description: 'Stock quantity to add or subtract',
    example: 10,
  })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
