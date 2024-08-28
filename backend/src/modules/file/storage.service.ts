import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {FileEntity} from "./file.entity";
import fs from "fs";
import * as path from "path";
import { v4 as createUUIDv4 } from 'uuid';
import formidable from 'formidable';
import fsPromises from "fs/promises";

@Injectable()
export class StorageService {
    public async saveFilesViaStream(stream): Promise<Pick<FileEntity, 'path' | 'filename' | 'mimetype' | 'size'>[]> {
        const randomPath = './file-storage/' + this.createRandomPath();

        await fsPromises.mkdir(randomPath, { recursive: true });

        const form = formidable({
            uploadDir: randomPath,
            keepExtensions: true,
            maxFileSize: Infinity,
            maxTotalFileSize: Infinity,
            filename: (...args) => args[0] + args[1],
        });

        return new Promise((resolve, reject) => {
            form.parse(stream, (error, _, files) => {
                if (error) {
                    reject(error);
                    return;
                }

                const dataOfFiles = Array.from(files.file).map((file: any) => ({
                    path: file.filepath,
                    filename: file.newFilename,
                    mimetype: file.mimetype,
                    size: file.size,
                }));

                resolve(dataOfFiles);
            });
        });
    }

    public async deleteFile(filePath: string): Promise<void> {
        if (!(await this.checkIfExists(filePath))) {
            throw new HttpException('File not found', HttpStatus.NOT_FOUND);
        }

        await fsPromises.unlink(filePath);
        await this.deleteEmptyDirectories(path.dirname(filePath));
    }

    public async  deleteEmptyDirectories(directory: string): Promise<void> {
        const isFileExists = await this.checkIfExists(directory);
        const isRootDirectory = directory.split('/').at(-1) === 'file-storage';

        if (isFileExists || isRootDirectory)  {
            return;
        }

        const files = await fsPromises.readdir(directory);

        if (files.length === 0) {
            await fsPromises.rmdir(directory);
            await this.deleteEmptyDirectories(path.dirname(directory));
        }
    }

    public getFileStream(filepath: string): fs.ReadStream {
        return fs.createReadStream(filepath);
    }

    public createRandomPath(): string {
        return createUUIDv4()
            .replace(/-/g, '')
            .slice(0, 8)
            .match(/(.{1,2})/gim)
            .join('/');
    }

    public async checkIfExists(path: string): Promise<boolean> {
        try {
            await fsPromises.access(path, fsPromises.constants.F_OK);

            return true;
        } catch {
            return false;
        }
    }
}
