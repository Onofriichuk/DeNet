import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import {FileEntity} from "./file.entity";
import { TypeOrmModule } from '@nestjs/typeorm';
import {StorageService} from "./storage.service";

@Module({
  imports: [
      TypeOrmModule.forFeature([
        FileEntity,
      ]),
  ],
  controllers: [FileController],
  providers: [FileService, StorageService]
})
export class FileModule {}
