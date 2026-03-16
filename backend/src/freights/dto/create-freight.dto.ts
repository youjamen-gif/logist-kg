import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator'

export class CreateFreightDto {
  @IsString()
  originCity: string

  @IsString()
  destinationCity: string

  @IsString()
  originCountry: string

  @IsString()
  destinationCountry: string

  @IsNumber()
  @Min(0.1)
  weight: number

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number

  @IsOptional()
  @IsString()
  currency?: string

  @IsString()
  truckType: string

  @IsOptional()
  @IsString()
  description?: string

  @IsDateString()
  loadingDate: string
}
