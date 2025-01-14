class CommonResponse<DataT> {
    data: DataT;
    message: string;
    code: number;
    success: boolean;
    [key: string]: any;
}

/**
 * 返回接口的通用响应
 */
const getCommonRes = <DataT>(res?:Partial<CommonResponse<DataT>>) => {
    const defaultRes = {
        data: {},
        message: '请求成功',
        code: 10000,
        success: true,
    };

    return Object.assign(defaultRes, res);
};


export { getCommonRes };


/**
 * 传入一个对象，将对象第一层的属性值全部转为json字符串。
 * 如果不能转为json字符串，则将属性值设置为空字符串。
 * @param obj 传入的对象
 * @param ignoreKeys 忽略的属性
 */
export const objToJsonStr = <T, ExcludeKeys extends keyof T = never>(obj: T, ignoreKeys:(ExcludeKeys)[]): (
    {[K in keyof T as K extends ExcludeKeys  ? never : K]:string;}
    &
    {[K in keyof T as K extends ExcludeKeys ? K : never]:T[K];}
) => {
    const newObj = {} as any;
    const keys = Object.keys(obj);
    for (const key of keys) {
        if (ignoreKeys.includes(key as any)) {
            newObj[key] = obj[key];
            continue;
        }
        try {
            newObj[key] = JSON.stringify(obj[key]);
        } catch (_e) {
            // eslint-disable-next-line quotes
            newObj[key] = "";
        }
    }
    return newObj;
};
