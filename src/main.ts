import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ReqValidationPipe } from './pipes/validation.pipe';
import { AllExceptionFilter } from './filters/all-exception.filter';

/** */
async function bootstrap () {
    const app = await NestFactory.create(AppModule);
    const httpAdapter = app.get(HttpAdapterHost);

    // 全局管道
    app.useGlobalPipes(ReqValidationPipe);

    // // 全局Filter只能有一个
    app.useGlobalFilters(new AllExceptionFilter(httpAdapter));

    await app.listen(3005);
}
bootstrap();
