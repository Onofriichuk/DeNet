import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { compare } from 'bcrypt';
import {AuthResponseDto} from "./dto/auth-response.dto";
import {UserService} from "../user/user.service";
import {UserDto} from "../user/dto/user.dto";
import {UserEntity} from "../user/user.entity";
import {JWT_EXPIRATION, JWT_SECRET} from "../../configs/auth.config";

@Injectable()
export class AuthService {
  constructor(
    private _userService: UserService,
  ) {}

  public async login(userDto: UserDto): Promise<AuthResponseDto> {
    const user = await this._userService.findByLogin(userDto.login);

    if (!user) {
      throw new HttpException(
        'Не правильный логин!',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const isPasswordCorrect = await compare(userDto.password, user.password);

    if (!isPasswordCorrect) {
      throw new HttpException(
        'Не правильный пароль!',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const token = this.generateJwt(user);

    return user.getAuthResponse(token);
  }

  public async registration(newUser: UserDto): Promise<AuthResponseDto> {
    const foundUser = await this._userService.findByLogin(newUser.login);

    if (foundUser) {
      throw new HttpException(
        'Пользователь с таким логином уже есть!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user: UserEntity = await this._userService.create(newUser);
    const token = this.generateJwt(user);

    return user.getAuthResponse(token);
  }

  public generateJwt(user: UserEntity): string {
    return sign(
      {
        id: user.id,
        username: user.login,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRATION },
    );
  }
}
