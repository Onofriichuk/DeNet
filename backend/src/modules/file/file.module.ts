import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import {fileMulter} from "./file.multer";
import {MulterModule} from "@nestjs/platform-express";
import {FileEntity} from "./file.entity";
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
      MulterModule.register(fileMulter),
      TypeOrmModule.forFeature([
        FileEntity,
      ]),
  ],
  controllers: [FileController],
  providers: [FileService]
})
export class FileModule {}
