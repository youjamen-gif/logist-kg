import { IsString } from 'class-validator'

export class CreateConversationDto {
  @IsString()
  freightId: string

  @IsString()
  driverId: string

  @IsString()
  shipperId: string
}
