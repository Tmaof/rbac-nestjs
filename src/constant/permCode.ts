
/** 权限信息 */
export type PermissionInfo = {
    /** 权限名称 */
    name: string;
    /** 权限代码 */
    code: string;
    desc?: string;
    /** 属于这一权限下的子权限 */
    children?: PermissionTree;
};

type PermissionTree = {
    [key: string]: PermissionInfo;
};

/**
 * 所有权限的树形结构，可以给路由添加权限的代码。
 * 需要和：
 * -数据库中的权限对应。
 * -前端的权限代码对应。
 */
export const permTree = {
    userPublic: {
        name: '对用户公开的接口',
        code: 'user-public',
    },
    permManage: {
        name: '权限管理',
        code: 'acl',
        children: {
            userList: {
                name: '用户列表',
                code: 'user-list',
                children: {
                    excelImport: {
                        name: '批量导出员工-excel',
                        code: 'excel-import',
                    },
                    deleteUser: {
                        name: '删除员工',
                        code: 'delete-user',
                    },
                    assignRole: {
                        name: '为员工分配角色',
                        code: 'assign-role',
                    },
                },
            },
            roleList: {
                name: '角色列表',
                code: 'role-list',
                children: {
                    addRole: {
                        name: '添加角色',
                        code: 'add-role',
                    },
                    deleteRole: {
                        name: '删除角色',
                        code: 'delete-role',
                    },
                    assignPerm: {
                        name: '为角色分配权限',
                        code: 'assign-perm',
                    },
                },
            },
            menuList: {
                name: '权限列表',
                code: 'menu-list',
                children: {
                    addPerm: {
                        name: '添加权限',
                        code: 'add-perm',
                        desc: 'api接口',
                    },
                    addRootPerm: {
                        name: '添加根权限',
                        code: 'add-root-perm',
                        desc: '前端按钮',
                    },
                    addChildrenPerm: {
                        name: '添加子权限',
                        code: 'add-children-perm',
                        desc: '前端按钮',
                    },
                    deletePerm: {
                        name: '删除权限',
                        code: 'delete-perm',
                    },
                },
            },
        },
    },
    clientManage: {
        name: '客户管理',
        code: 'client-management',
    },
};
