import { IsString, MinLength } from 'class-validator'

export class AttachVehicleDocumentDto {
  @IsString()
  @MinLength(3)
  fileUrl: string
}
