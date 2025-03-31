import * as fs from 'fs';
import * as dotenv from 'dotenv';
import path = require('path');

/** 通用配置文件路径 */
const commonEnvFilePath = path.join(__dirname, 'env/.env.common');

/** 环境变量文件路径 */
export const envFilePath = path.join(__dirname, `env/.env.${process.env.NODE_ENV || 'development'}`);

/** 本地环境变量文件，不提交git，用于隐私配置，如支付配置 */
export const envFileLocalPath = path.join(__dirname, `env/.env.${process.env.NODE_ENV || 'development'}.local`);

/** 环境变量文件路径: 通用 + 当前 */
export const envFilePathAll = [commonEnvFilePath, envFilePath, envFileLocalPath];

/** 实体文件路径 */
// 注意：path.resolve和path.join的区别；最终是运行打包的代码在dist目录中
export const entitiesPaths = [path.join(__dirname, '/modules', '/**/*.entity{.ts,.js}')];

/** 获取配置对象 */
function getServerConfig () {
    /** 读取不同的.env文件 */
    function getEnv (path: string): Record<string, unknown> {
        if (fs.existsSync(path)) {
            return dotenv.parse(fs.readFileSync(path));
        }
        return {};
    }

    let config = {};
    for (const path of envFilePathAll) {
        config = {
            ...config,
            ...getEnv(path),
        };
    }
    return config;
}

export const serverConfig = getServerConfig();

console.info('serverConfig', serverConfig);
console.info('entitiesPaths', entitiesPaths);
console.info('envFilePathAll', envFilePathAll);
