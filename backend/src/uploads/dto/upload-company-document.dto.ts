import { IsString, MinLength } from 'class-validator'

export class UploadCompanyDocumentDto {
  @IsString()
  type: string

  @IsString()
  @MinLength(3)
  fileUrl: string
}
