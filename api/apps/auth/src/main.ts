import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import {CommonService} from "@app/common";
import {ConfigService} from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);

  const configService = app.get(ConfigService);
  const commonService = app.get(CommonService);

  const queue = configService.get('RABBITMQ_AUTH_QUEUE');

  app.connectMicroservice(commonService.getRmqOptions(queue, true));
  await app.startAllMicroservices();
}
bootstrap();
