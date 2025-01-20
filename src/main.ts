import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ReqValidationPipe } from './pipes/validation.pipe';
import { AllExceptionFilter } from './filters/all-exception.filter';
import { serverConfig } from 'config';
import { ConfigEnum } from 'config/env/config.enum';

/** */
async function bootstrap () {
    const app = await NestFactory.create(AppModule);
    const httpAdapter = app.get(HttpAdapterHost);

    // 全局管道
    app.useGlobalPipes(ReqValidationPipe);

    // // 全局Filter只能有一个
    app.useGlobalFilters(new AllExceptionFilter(httpAdapter));

    const port = serverConfig[ConfigEnum.APP_PORT] as number;
    await app.listen(port);
}
bootstrap();
