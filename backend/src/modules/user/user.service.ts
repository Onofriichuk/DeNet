import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private _repository: Repository<UserEntity>,
  ) {}

  public async create(newUser: UserDto): Promise<UserEntity> {
    const user = new UserEntity();

    Object.assign(user, newUser);

    await this._repository.save(user);

    return user;
  }

  public async findById(id: number): Promise<UserEntity> {
    return this._repository.findOne({
      where: { id },
    });
  }

  public async findByLogin(login: string): Promise<UserEntity> {
    return this._repository.findOne({
      where: { login },
    });
  }
}
