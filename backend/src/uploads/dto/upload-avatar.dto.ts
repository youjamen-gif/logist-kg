import { IsString, MinLength } from 'class-validator'

export class UploadAvatarDto {
  @IsString()
  @MinLength(3)
  fileUrl: string
}
