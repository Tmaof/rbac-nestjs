import { Permission } from '@/permission/permission.entity';
import { User } from '@/user/user.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn, JoinTable } from 'typeorm';


@Entity('role')
export class Role {
    @PrimaryGeneratedColumn({ comment: '角色ID，主键' })
        id: number;

    @Column({ comment: '角色名称' })
        title: string;

    @Column({ comment: '角色描述' })
        describe: string;

    /** 用户-角色关联表 */
    @ManyToMany(() => User, (user) => user.role)
    @JoinTable({ name: 'user_role' })
        user: User[];

    /** 角色-权限关联表 */
    @ManyToMany(() => Permission, (Permission) => Permission.role)
    @JoinTable({ name: 'role_permission' })
        permission: Permission[];
}
