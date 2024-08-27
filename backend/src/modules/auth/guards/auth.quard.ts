import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class AuthUserGuard implements CanActivate {
  public canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const ignoreUrls = ['/auth/registration', '/auth/login'];

    if (ignoreUrls.includes(request.originalUrl)) {
      return true;
    }

    if (!request.user) {
      throw new HttpException('Not authorized', HttpStatus.UNAUTHORIZED);
    }

    return true;
  }
}
