import { IsEmail, IsIn, IsOptional, IsString, MinLength } from 'class-validator'

export class RegisterDto {
  @IsString()
  name: string

  @IsEmail()
  email: string

  @IsOptional()
  @IsString()
  phone?: string

  @IsString()
  @MinLength(6)
  password: string

  @IsString()
  @IsIn(['driver', 'shipper', 'dispatcher'])
  role: string
}
