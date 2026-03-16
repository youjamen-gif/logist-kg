import { IsString, MinLength } from 'class-validator'

export class UploadDriverDocumentDto {
  @IsString()
  type: string

  @IsString()
  @MinLength(3)
  fileUrl: string
}
