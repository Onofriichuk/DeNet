import {
    Injectable,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import {Repository} from "typeorm";
import {FileEntity} from "./file.entity";
import {FileResponseDto} from "./dto/file-response.dto";
import {UserEntity} from "../user/user.entity";
import * as fs from "fs";
import express from "express";
import {InjectRepository} from "@nestjs/typeorm";
import {StorageService} from "./storage.service";

@Injectable()
export class FileService {
    constructor(
        @InjectRepository(FileEntity)
        private _repository: Repository<FileEntity>,
        private _storageService: StorageService,
    ) {}

    public async download(user: UserEntity, fileId: number, res: express.Response): Promise<void> {
        const file = await this.getFileById(user, fileId);

        if (!file) {
            throw new HttpException('File not found', HttpStatus.NOT_FOUND);
        }

        try {
            const encodedFilename = encodeURIComponent(file.filename);

            res.set({
                'Content-Type': file.mimetype,
                'Content-Disposition': `attachment; filename*=UTF-8''${encodedFilename}`,
                'Content-Length': file.size,
            });

            this._storageService.getFileStream(file.path).pipe(res);
        } catch (err) {
            throw new HttpException('Error!', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public async uploadFiles(req: express.Request, user: UserEntity): Promise<FileResponseDto[]> {
        if (!req.headers['content-type']?.includes('multipart/form-data')) {
            throw new HttpException('Invalid content type', HttpStatus.BAD_REQUEST);
        }

        const files = await this._storageService.saveFilesViaStream(req);

        const fileEntities = files.map(file => {
           const entity = new FileEntity();

           Object.assign(entity, file);
           entity.user = user;

           return entity;
       });

        await Promise.all(fileEntities.map(entity => entity.save()))

        return fileEntities.map(file => file.getResponse());
    }

    public async getFileById({ id: userId }: UserEntity, id: number): Promise<FileResponseDto> {
        const file = await this._repository.findOneBy({
            id,
            user: {  id: userId }
        });

        if (!file) {
            throw new HttpException('File not found', HttpStatus.NOT_FOUND);
        }

        return file?.getResponse();
    }


    public async getFiles({ id: userId }: UserEntity): Promise<FileResponseDto[]> {
        const files = await this._repository.find({
            where: { user: { id: userId } },
        })

        return files.map(f => f.getResponse());
    }

    public async deleteFileById({ id: userId }: UserEntity, id: number): Promise<boolean> {
        const file = await this._repository.findOneBy({
            id,
            user: {  id: userId }
        });

        if (!file) {
            throw new HttpException('File not found', HttpStatus.NOT_FOUND);
        }

        try {
            await this._repository.delete(id);
            await this._storageService.deleteFile(file.path);

            return true;
        } catch (error) {
            return false;
        }
    }
}
