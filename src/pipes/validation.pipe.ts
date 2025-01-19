import { ResCodeEnum } from '@/enum';
import { getCommonRes } from '@/utils';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

/** 开启参数验证 */
export const ReqValidationPipe = new ValidationPipe({
    // 去除在dto类上任何没有任何装饰器的属性。某些属性不需要排除 可以使用 @Allow
    whitelist: true,
    // transform 属性是一个布尔值，用于启用或禁用自动转换。如果设置为 true，ValidationPipe 会尝试将传入的对象转换为 DTO 类的实例，并根据 DTO 类中的类型装饰器进行类型转换。
    transform: true,
    // transformOptions 属性是一个对象，允许你进一步自定义转换过程。例如，你可以使用 enableImplicitConversion 选项来启用隐式类型转换。
    transformOptions: { enableImplicitConversion: true },
    // 自定义验证失败时的响应格式
    exceptionFactory: (errors) => {
        const messages = errors.map((error, index) => {
            return `[${index}]. ${Object.values(error.constraints).join(';')}`;
        });
        const res = getCommonRes({ message: messages.join('\n'), success: false, code: ResCodeEnum.reqArgError });
        return new BadRequestException(res);
    },
});

