import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  readonly token: string;

  @ApiProperty()
  readonly login: string;
}
