import { Role } from '@/modules/role/role.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn, JoinTable } from 'typeorm';

@Entity('permission')
export class Permission {
    @PrimaryGeneratedColumn({ comment: '权限ID，主键' })
        id: number;

    @Column({ comment: '父级权限ID' })
        pid: number;

    @Column({ comment: '权限名称' })
        name: string;

    @Column({ comment: '权限类型' })
        type: number;

    @Column({ comment: '权限代码' })
        code: string;

    /** 角色-权限关联表 */
    @ManyToMany(() => Role, (role) => role.permission)
    @JoinTable({ name: 'role_permission' })
        role: Role[];
}
