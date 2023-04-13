import { NestFactory } from '@nestjs/core';
import {CommonService} from "@app/common";
import {ConfigService} from "@nestjs/config";
import {ProfileModule} from "./profile.module";

async function bootstrap() {
  const app = await NestFactory.create(ProfileModule);

  const configService = app.get(ConfigService);
  const commonService = app.get(CommonService);

  const queue = configService.get('RABBITMQ_PROFILE_QUEUE');

  app.connectMicroservice(commonService.getRmqOptions(queue));
  await app.startAllMicroservices();
}
bootstrap();
