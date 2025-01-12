

class GetRoleListItem {
    id: number;

    name: string;

    describe: string;

    /** 该角色 拥有的 权限id 列表 */
    permissions: number[];

    /** 该角色 拥有的 权限名称 列表 */
    names:string[];
}

export type GetRoleListDto = Array<GetRoleListItem>;
