import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import {CommonModule, CommonService, PostgresDBModule, Profile} from "@app/common";
import {SequelizeModule} from "@nestjs/sequelize";


@Module({
  imports: [
    CommonModule,
    CommonModule.registerRmq({
      name: 'PROFILE',
    }),
    PostgresDBModule,
    SequelizeModule.forFeature([Profile])
  ],
  controllers: [ProfileController],
  providers: [ProfileService, CommonService],
})
export class ProfileModule {}
