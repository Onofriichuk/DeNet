import {
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Req,
    Response,
} from '@nestjs/common';
import {ApiOkResponse, ApiTags, ApiConsumes} from "@nestjs/swagger";
import {User} from "../user/decorators/user.decorator";
import {UserEntity} from "../user/user.entity";
import {FileResponseDto} from "./dto/file-response.dto";
import {FileService} from "./file.service";
import express from 'express';

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
        @Response() res: express.Response
    ): Promise<void> {
        await this.download(user, id, res);
    }

    @Post('/upload')
    @ApiConsumes('multipart/form-data')
    @ApiOkResponse({ type: [FileResponseDto] })
    public async uploadFile(
        @User() user: UserEntity,
        @Req() req: express.Request,
    ): Promise<FileResponseDto[]> {
        return this._service.uploadFiles(req, user);
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
        return this._service.getFileById(user, id)
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
