import { Injectable, NestMiddleware } from '@nestjs/common';
import { ServerResponse } from 'http';
import {AuthService} from "../../auth/auth.service";

@Injectable()
export class UpdateTokenMiddleware implements NestMiddleware {
  constructor(private readonly _authService: AuthService) {}

  public use(req: any, res: ServerResponse): void {
    if (res.statusCode < 300 && req.user) {
      const token = 'Bearer ' + this._authService.generateJwt(req.user);

      res.writeHead(res.statusCode, { Authorization: token });
    }

    res.end();
  }
}
