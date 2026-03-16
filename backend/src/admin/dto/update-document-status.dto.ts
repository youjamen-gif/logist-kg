import { IsIn, IsString } from 'class-validator'

export class UpdateDocumentStatusDto {
  @IsString()
  @IsIn(['pending', 'approved', 'rejected'])
  status: string
}
