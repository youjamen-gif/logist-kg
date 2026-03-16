import { IsIn, IsString } from 'class-validator'

export class UpdateBidStatusDto {
  @IsString()
  @IsIn(['pending', 'accepted', 'rejected', 'cancelled'])
  status: string
}
