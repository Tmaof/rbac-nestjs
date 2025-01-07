import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '@/modules/user/user.entity';

@Entity('user_log')
export class UserLog {
    @PrimaryGeneratedColumn({ comment: '日志ID' })
        id: number;

    @Column({ comment: '请求路径' })
        path: string;

    @Column({ comment: '请求方法' })
        methods: string;

    @Column({ comment: '请求数据' })
        data: string;

    @Column({ comment: '请求结果' })
        result: number;

    @Column({ comment: '请求ip' })
        ip: string;

    @Column({ comment: '请求时间' })
        time: Date;

    @Column({ comment: '用户代理' })
        user_agent: string;

    /** 用户-日志关联表 */
    @ManyToOne(() => User, (user) => user.log)
    @JoinColumn()
        user: User;
}
