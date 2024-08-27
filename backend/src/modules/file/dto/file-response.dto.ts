import {ApiProperty} from "@nestjs/swagger";

export class FileResponseDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    path: string;

    @ApiProperty()
    filename: string;

    @ApiProperty()
    mimetype: string;

    @ApiProperty()
    size: number;
}
