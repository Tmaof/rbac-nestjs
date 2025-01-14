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

    @Column({ comment: '请求头', type: 'text' })
        reqHeader: string;
    /**
     * TEXT: 最大长度为 65,535 字节（2^16 - 1），大约是 64KB。
       MEDIUMTEXT: 最大长度为 16,777,215 字节（2^24 - 1），大约是 16MB。
       VARCHAR 可以存储可变长度的字符串，最大长度为 65,535 字节（从 MySQL 5.0.3 开始）。不过，这个最大长度受行的最大大小限制，所有列加起来不能超过 65,535 字节。
    */
    @Column({ comment: '请求数据', type: 'text' })
        reqBody: string;

    @Column({ comment: '请求数据', type: 'text' })
        reqQuery: string;

    @Column({ comment: '请求数据', type: 'text' })
        reqParams: string;

    @Column({ comment: '请求结果', type: 'text' })
        resBody: string;

    @Column({ comment: '请求ip' })
        ip: string;

    @Column({ comment: '请求时间' })
        time: Date;
    @Column({ comment: '请求处理时间，单位毫秒' })
        handeTime: number;
    /** 用户-日志关联表 */
    @ManyToOne(() => User, (user) => user.log)
    @JoinColumn()
        user: User;
}
