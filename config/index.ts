import * as fs from 'fs';
import * as dotenv from 'dotenv';
import path = require('path');

/** 通用配置文件路径 */ // 注意：这里不能使用 __dirname__ 因为它是在编译后运行的，表示：rbac-nestjs\\dist\\config，而环境变量文件不会被打包到dist中
const commonEnvFilePath = path.resolve('config', 'env/.env.common');

/** 环境变量文件路径 */
export const envFilePath = path.resolve('config', `env/.env.${process.env.NODE_ENV || 'development'}`);

/** 环境变量文件路径: 通用 + 当前 */
export const envFilePathAll = [commonEnvFilePath, envFilePath];

/** 实体文件路径 */
export const entitiesPaths = [path.resolve('src/modules', '/**/*.entity{.ts,.js}')];

/** 获取配置对象 */
function getServerConfig () {
    /** 读取不同的.env文件 */
    function getEnv (path: string): Record<string, unknown> {
        if (fs.existsSync(path)) {
            return dotenv.parse(fs.readFileSync(path));
        }
        return {};
    }

    const commonConfig = getEnv(commonEnvFilePath);
    const envConfig = getEnv(envFilePath);

    const config = { ...commonConfig, ...envConfig };
    return config;
}

export const serverConfig = getServerConfig();

// console.info('serverConfig', serverConfig);
