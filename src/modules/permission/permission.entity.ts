import { Role } from '@/modules/role/role.entity';
import {
    Column, Entity, ManyToMany, PrimaryGeneratedColumn, JoinTable, JoinColumn, ManyToOne, OneToMany
} from 'typeorm';

@Entity('permission')
export class Permission {
    @PrimaryGeneratedColumn({ comment: '权限ID，主键' })
        id: number;


    @Column({ comment: '权限名称' })
        name: string;

    @Column({ comment: '权限类型。为1代表页面权限，为2代表按钮权限。' })
        type: number;

    @Column({ comment: '权限代码，唯一', unique: true })
        code: string;

    /**
     * 角色-权限关联表 。
     * 删除一个权限的时候，同时删除它在角色-权限关联表中的记录。
     */
    @ManyToMany(() => Role, (role) => role.permission, { cascade: ['remove'] })
    @JoinTable({ name: 'role_permission' })
        role: Role[];

    /** 一个父权限 可以 有多个子权限 */
    @OneToMany(() => Permission, (permission) => permission.parentPermission)
        children:Permission[];

    /** 一个子权限 只能 有一个父权限 */
    @ManyToOne(() => Permission, (permission) => permission.children)
    @JoinColumn()
        parentPermission: Permission;
}
