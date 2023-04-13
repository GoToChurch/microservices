import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import {PostgresDBModule} from "@app/common/modules/postresdb.module";
import {AuthModule} from "../../auth/src/auth.module";
import {ProfileModule} from "../../profile/src/profile.module";
import {CommonModule} from "@app/common";



@Module({
  imports: [
      CommonModule.registerRmq({
          name: 'AUTH',
      }),
      CommonModule.registerRmq({
          name: 'PROFILE',
      }),
      // PostgresDBModule,
      // AuthModule,
      // ProfileModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
