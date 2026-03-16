import { IsNumber, IsOptional, IsString, Min } from 'class-validator'

export class CreateBidDto {
  @IsString()
  freightId: string

  @IsNumber()
  @Min(0)
  price: number

  @IsOptional()
  @IsString()
  message?: string
}
