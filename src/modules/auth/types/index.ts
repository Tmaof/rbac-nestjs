
/** jwt 负载 */
export type JwtPayloadInfo = {
    username:string;

    id:number;
}

/** jwt 负载 解析后，添加到 请求对象 req 中  */
export type JwtPayloadParsed = {
    /** jwt 负载 */
    username:string;

    /** jwt 签名 */
    userId:number;
}
