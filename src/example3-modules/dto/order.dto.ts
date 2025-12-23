import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty, IsOptional, Min } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    description: 'Customer name',
    example: 'Jane Smith',
  })
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @ApiProperty({
    description: 'Product ordered',
    example: 'Laptop',
  })
  @IsString()
  @IsNotEmpty()
  product: string;

  @ApiProperty({
    description: 'Order quantity',
    example: 2,
    minimum: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  quantity: number;

  @ApiProperty({
    description: 'Total amount',
    example: 1999.98,
    minimum: 0,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  totalAmount: number;
}

export class UpdateOrderDto {
  @ApiProperty({
    description: 'Customer name',
    example: 'Jane Smith Updated',
    required: false,
  })
  @IsString()
  @IsOptional()
  customerName?: string;

  @ApiProperty({
    description: 'Order status',
    example: 'shipped',
    required: false,
  })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({
    description: 'Order quantity',
    example: 3,
    minimum: 1,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  quantity?: number;
}

export class RefundDto {
  @ApiProperty({
    description: 'Reason for refund',
    example: 'Product defective',
  })
  @IsString()
  @IsNotEmpty()
  reason: string;

  @ApiProperty({
    description: 'Refund amount',
    example: 999.99,
    minimum: 0,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  amount: number;
}
