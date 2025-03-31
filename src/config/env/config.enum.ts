/**
 * 配置枚举，用于定义应用程序中使用的配置键。
 * 这些键对应于环境变量或配置文件中的设置。
 */
export enum ConfigEnum {
    /**
     * 数据库类型配置键。
     * 用于指定应用程序使用的数据库类型。
     */
    DB_TYPE = 'DB_TYPE',
    /**
     * 数据库主机配置键。
     * 用于指定数据库服务器的主机地址。
     */
    DB_HOST = 'DB_HOST',
    /**
     * 数据库端口配置键。
     * 用于指定数据库服务器监听的端口号。
     */
    DB_PORT = 'DB_PORT',
    /**
     * 数据库名称配置键。
     * 用于指定应用程序连接的数据库名称。
     */
    DB_DATABASE = 'DB_DATABASE',
    /**
     * 数据库用户名配置键。
     * 用于指定连接数据库时使用的用户名。
     */
    DB_USERNAME = 'DB_USERNAME',
    /**
     * 数据库密码配置键。
     * 用于指定连接数据库时使用的密码。
     */
    DB_PASSWORD = 'DB_PASSWORD',
    /**
     * 数据库同步配置键。
     * 用于指定是否在启动时自动同步数据库模式。
     */
    DB_SYNC = 'DB_SYNC',
    /**
     * 数据库日志记录配置键。
     * 用于指定是否启用数据库查询日志记录。
     */
    DB_LOGGING = 'DB_LOGGING',
    /**
     * 应用程序密钥配置键。
     * 用于指定应用程序用于加密和解密数据的密钥。
     */
    JWT_SECRET = 'JWT_SECRET',
    /**
     * JWT过期时间配置键。
     * 用于指定JWT的过期时间。
     */
    JWT_EXPIRES_IN = 'JWT_EXPIRES_IN',
    /**
     * 应用程序端口配置键。
     * 用于指定应用程序监听的端口号。
     */
    APP_PORT = 'APP_PORT',
}
