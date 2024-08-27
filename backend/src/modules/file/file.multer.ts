import {diskStorage} from "multer";
import {MulterOptions} from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import { v4 as createUUIDv4 } from 'uuid';
import * as fs from 'fs/promises';

export const fileMulter: MulterOptions = {
    storage: diskStorage({
        destination: async (_, file, cb) => {
            const randomPath = `./file-storage/${createRandomPath()}`;

            await fs.mkdir(randomPath, { recursive: true });

            cb(null, randomPath);
        },
        filename: (_, {originalname}, cb) => {
            cb(null, Buffer.from(originalname, 'latin1').toString('utf8'));
        },
    }),
    limits: { fileSize: 2 * 1024 * 1024 * 1024 },
};

function createRandomPath() {
    return createUUIDv4()
        .replace(/-/g, '')
        .slice(0, 8)
        .match(/(.{1,2})/gim)
        .join('/');
}
