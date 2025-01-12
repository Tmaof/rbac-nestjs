

export class GetPermissionListItem {
    id: number;
    pid: number;
    name: string;
    code: string;
    type: number;
    children: GetPermissionListItem[];
}

/** 获取所有权限-权限树 */
export type GetPermissionListDto = GetPermissionListItem[]
