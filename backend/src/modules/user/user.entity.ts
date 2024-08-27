import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { hash } from 'bcrypt';
import {FileEntity} from "../file/file.entity";
import {AuthResponseDto} from "../auth/dto/auth-response.dto";

@Entity()
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  login: string;

  @Column()
  password: string;

  @BeforeInsert()
  public async hashPassword() {
    this.password = await hash(this.password, 10);
  }

  @OneToMany(() => FileEntity, (c: FileEntity) => c.user, {
    eager: true
  })
  files: FileEntity[];

  public getAuthResponse(token: string): AuthResponseDto {
    return {
      id: this.id,
      token,
      login: this.login,
    };
  }
}
