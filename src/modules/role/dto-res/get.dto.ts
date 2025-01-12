

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


export class GetRolePermissionsListItem {
    id: number;
    pid: number;
    type: number;
    name: string;
    code: string;
    /** select为1表示该角色拥有该权限，为0表示该角色没有该权限。 */
    select:number;
    /** 该权限的子权限 */
    children: GetRolePermissionsListItem[];
}

/**
 * 获取指定角色的权限（用于分配权限）
 * @param {} list list中的每个对象中的select为1表示该角色拥有该权限，为0表示该角色没有该权限。
 * @param {} selected 该角色拥有的权限id列表。
*/
export class GetRolePermissionsDto {
    list: GetRolePermissionsListItem[];

    selected:number[];
}
