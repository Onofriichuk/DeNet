import {MiddlewareConsumer, Module, RequestMethod} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {FileModule} from "./modules/file/file.module";
import {AuthMiddleware} from "./modules/auth/middlewares/auth.middleware";
import {AuthModule} from "./modules/auth/auth.module";
import {UserModule} from "./modules/user/user.module";
import {ormconfig} from "./configs/typeorm.config";
import {TypeOrmModule} from "@nestjs/typeorm";

@Module({
  imports: [
      TypeOrmModule.forRoot({
          ...ormconfig,
          autoLoadEntities: true
      }),
      FileModule,
      AuthModule,
      UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
        .apply(AuthMiddleware)
        .exclude(
            { path: '/login', method: RequestMethod.POST },
            { path: '/registration', method: RequestMethod.DELETE },
        )
        .forRoutes({
          path: '*',
          method: RequestMethod.ALL,
        });
  }
}
