import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {AuthUserGuard} from "./modules/auth/guards/auth.quard";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.useGlobalGuards(new AuthUserGuard());

  const config = new DocumentBuilder()
      .setTitle('DeNet example')
      .setDescription('The DeNet API description')
      .setVersion('1.0')
      .addTag('DeNet')
      .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(3000);
}
bootstrap();
