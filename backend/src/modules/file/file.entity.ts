import {
    BaseEntity,
    ManyToOne,
    Column,
    Entity,
    PrimaryGeneratedColumn
} from "typeorm";
import {UserEntity} from "../user/user.entity";
import {FileResponseDto} from "./dto/file-response.dto";

@Entity()
export class FileEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    path: string;

    @Column()
    filename: string;

    @Column()
    mimetype: string;

    @Column('bigint')
    size: number;

    @ManyToOne(() => UserEntity, (u: UserEntity) => u.files)
    user: UserEntity;

    public getResponse(): FileResponseDto {
        return {
            id: this.id,
            path: this.path,
            filename: this.filename,
            mimetype: this.mimetype,
            size: this.size,
        };
    }
}
