import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator'

export class UpdateFreightDto {
  @IsOptional()
  @IsString()
  originCity?: string

  @IsOptional()
  @IsString()
  destinationCity?: string

  @IsOptional()
  @IsString()
  originCountry?: string

  @IsOptional()
  @IsString()
  destinationCountry?: string

  @IsOptional()
  @IsNumber()
  @Min(0.1)
  weight?: number

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number

  @IsOptional()
  @IsString()
  currency?: string

  @IsOptional()
  @IsString()
  truckType?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsDateString()
  loadingDate?: string

  @IsOptional()
  @IsString()
  status?: string
}
