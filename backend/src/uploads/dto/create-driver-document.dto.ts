import { IsString, IsOptional } from 'class-validator';

export class CreateDriverDocumentDto {
  @IsString()
  type: string;

  @IsString()
  url: string;

  @IsOptional()
  @IsString()
  vehicleId?: string;
}
