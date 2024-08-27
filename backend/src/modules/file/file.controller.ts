import {
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Post,
    Response,
    UploadedFiles,
    UseInterceptors
} from '@nestjs/common';
import {ApiOkResponse, ApiTags, ApiConsumes} from "@nestjs/swagger";
import {User} from "../user/decorators/user.decorator";
import {UserEntity} from "../user/user.entity";
import {FileResponseDto} from "./dto/file-response.dto";
import {FilesInterceptor} from "@nestjs/platform-express";
import {FileService} from "./file.service";
import { Response as Res } from 'express';

@ApiTags('Files')
@Controller('files')
export class FileController {
    constructor(
        private _service: FileService,
    ) {}

    @Get('/:id/download')
    public async download(
        @User() user: UserEntity,
        @Param('id') id: number,
        @Response() res: Res
    ): Promise<void> {
        const file = await this._service.getFileById(user, id);

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

            this._service.getFileStream(file.path).pipe(res);
        } catch (err) {
            throw new HttpException('Error!', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('/upload')
    @ApiConsumes('multipart/form-data')
    @ApiOkResponse({ type: [FileResponseDto] })
    @UseInterceptors(FilesInterceptor('file'))
    public async uploadFile(
        @User() user: UserEntity,
        @UploadedFiles() files: Express.Multer.File[]
    ): Promise<FileResponseDto[]> {
        return this._service.uploadFiles(user, files);
    }

    @Get('/')
    @ApiOkResponse({ type: [FileResponseDto] })
    public getFiles(@User() user: UserEntity): Promise<FileResponseDto[]> {
        return this._service.getFiles(user);
    }

    @Get('/:id')
    @ApiOkResponse({ type: FileResponseDto })
    public async getFile(
        @User() user: UserEntity,
        @Param('id') id: number,
    ): Promise<FileResponseDto> {
        const file = await this._service.getFileById(user, id);

        if (!file) {
            throw new HttpException('File not found', HttpStatus.NOT_FOUND);
        }

        return file
    }

    @Delete('/:id/delete')
    @ApiOkResponse({ type: Boolean })
    public deleteFile(
        @User() user: UserEntity,
        @Param('id') id: number,
    ): Promise<boolean> {
        return this._service.deleteFileById(user, id);
    }
}
