import {
    Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Role } from '@/modules/role/role.entity';
import { UserLog } from '@/modules/user-log/user-log.entity';

@Entity('user')
export class User {
    @PrimaryGeneratedColumn({ comment: '员工ID，主键' })
        id: number;

    @Column({ unique: true, comment: '用户名' })
        username: string;

    @Column({ comment: '密码' })
    @Exclude()
        password: string;

    @Column({ type: 'datetime', comment: '开通时间' })
        openTime: Date;

    @Column({ comment: '头像URL' })
        avatar: string;

    @Column({ comment: '性别' })
        gender: number;

    /** 用户-角色关联表 */
    @ManyToMany(() => Role, (role) => role.user, { cascade: ['insert'] })
    @JoinTable({ name: 'user_role' })
        role: Role[];

    /** 用户-日志关联 */
    @OneToMany(() => UserLog, (userLog) => userLog.user)
        log:UserLog[];

    constructor (user: Partial<User>) {
        this.openTime = new Date();
        this.avatar = 'https://www.maofu123.top/qiniuyun-68aaec38a9bcb79c31fc90738b18e603-maofu-%E5%8A%A8%E6%BC%AB%E5%A4%B4%E5%83%8F.webp';
        this.gender = 0;
        Object.assign(this, user);
    }
}
