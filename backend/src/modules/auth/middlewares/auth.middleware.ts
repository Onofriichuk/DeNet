import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { UserService } from '../../user/user.service';
import {JWT_SECRET} from "../../../configs/auth.config";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private _userService: UserService) {}

  public async use(request: any, _: Response, next: NextFunction): Promise<void> {
    if (!request.headers['x-access-token']) {
      request.user = null;
      next();

      return;
    }

    const token = request.headers['x-access-token'];

    try {
      const decode = verify(token, JWT_SECRET);
      const user = await this._userService.findById(decode.id);

      request.user = user;
      next();
    } catch (error) {
      request.user = null;
      next();
    }
  }
}
