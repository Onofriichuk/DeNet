import {password, url_db, username, database} from "./database.config";
import { ConnectionOptions } from "typeorm";

export const ormconfig: ConnectionOptions = {
    type: 'postgres',
    url: url_db,
    username: username,
    password: password,
    database: database,
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
}
