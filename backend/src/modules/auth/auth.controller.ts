import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthResponseDto } from './dto/auth-response.dto';
import {UserDto} from "../user/dto/user.dto";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post('/login')
  @ApiBody({ type: UserDto })
  @ApiOkResponse({ type: AuthResponseDto })
  public login(@Body() dto: UserDto): Promise<AuthResponseDto> {
    return this._authService.login(dto);
  }

  @Post('/registration')
  @ApiBody({ type: UserDto })
  @ApiOkResponse({ type: AuthResponseDto })
  public registration(@Body() dto: UserDto): Promise<AuthResponseDto> {
    return this._authService.registration(dto);
  }
}
