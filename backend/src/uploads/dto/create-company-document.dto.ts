import { IsString } from 'class-validator';

export class CreateCompanyDocumentDto {
  @IsString()
  type: string;

  @IsString()
  url: string;
}
