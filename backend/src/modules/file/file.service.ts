import {
    Injectable,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {FileEntity} from "./file.entity";
import {FileResponseDto} from "./dto/file-response.dto";
import {UserEntity} from "../user/user.entity";
import * as fs from "fs";
import * as path from "path";

@Injectable()
export class FileService {
    constructor(
        @InjectRepository(FileEntity)
        private _repository: Repository<FileEntity>
    ) {}

    public async uploadFiles(user: UserEntity, files: Express.Multer.File[]): Promise<FileResponseDto[]> {
       const fileEntities = files.map(file => {
           const entity = new FileEntity();

           Object.assign(entity, file);
           entity.user = user;

           return entity;
       })

        await Promise.all(fileEntities.map(entity => entity.save()))

        return fileEntities.map(file => file.getResponse());
    }

    public async getFileById({ id: userId }: UserEntity, id: number): Promise<FileResponseDto> {
        const file = await this._repository.findOneBy({
            id,
            user: {  id: userId }
        });

        return file?.getResponse();
    }

    public getFileStream(filepath: string) {
        return fs.createReadStream(filepath);
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
            await this.deleteFile(file.path);

            return true;
        } catch (error) {
            return false;
        }
    }

    private async deleteFile(filePath: string): Promise<void> {
        if (!fs.existsSync(filePath)) {
            throw new HttpException('File not found', HttpStatus.NOT_FOUND);
        }

        fs.unlinkSync(filePath);

        this.deleteEmptyDirectories(path.dirname(filePath));
    }

    private deleteEmptyDirectories(directory: string): void {
        if (!fs.existsSync(directory)) {
            return;
        }

        const files = fs.readdirSync(directory);

        if (files.length === 0) {
            fs.rmdirSync(directory);

            this.deleteEmptyDirectories(path.dirname(directory));
        }
    }
}
