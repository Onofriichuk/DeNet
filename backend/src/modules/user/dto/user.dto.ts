import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class UserDto {

  @ApiProperty({ required: true})
  @IsString()
  @MinLength(5)
  @MaxLength(10)
  readonly login: string;

  @ApiProperty({ required: true })
  @IsString()
  @MinLength(5)
  @MaxLength(10)
  readonly password: string;
}
