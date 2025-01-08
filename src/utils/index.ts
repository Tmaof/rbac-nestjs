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
const getCommonRes = <DataT>(res:Partial<CommonResponse<DataT>>) => {
    const defaultRes = {
        data: {},
        message: '请求成功',
        code: 10000,
        success: true,
    };

    return Object.assign(defaultRes, res);
};


export { getCommonRes };
