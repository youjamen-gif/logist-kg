import { IsNumber, IsOptional, IsString, Min } from 'class-validator'

export class CreateVehicleDto {
  @IsString()
  plateNumber: string

  @IsOptional()
  @IsString()
  trailerNumber?: string

  @IsString()
  truckType: string

  @IsNumber()
  @Min(0.1)
  capacity: number

  @IsOptional()
  @IsString()
  dimensions?: string
}
