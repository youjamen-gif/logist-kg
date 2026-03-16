import { IsString, MinLength } from 'class-validator'

export class CreateReportDto {
  @IsString()
  targetEntityType: string

  @IsString()
  targetEntityId: string

  @IsString()
  reportType: string

  @IsString()
  @MinLength(3)
  message: string
}
