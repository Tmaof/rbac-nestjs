import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ReqValidationPipe } from './pipes/validation.pipe';

/** */
async function bootstrap () {
    const app = await NestFactory.create(AppModule);

    // 全局管道
    app.useGlobalPipes(ReqValidationPipe);

    await app.listen(3005);
}
bootstrap();
