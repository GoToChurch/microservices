import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {JwtModule} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {CommonModule, CommonService, PostgresDBModule, Profile, User} from "@app/common";
import {SequelizeModule} from "@nestjs/sequelize";


@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: '24h'
        },
      }),
      inject: [ConfigService],
    }),
    CommonModule.registerRmq({
      name: 'PROFILE',
    }),
    CommonModule.registerRmq({
      name: 'AUTH',
    }),
      CommonModule,
      PostgresDBModule,
    SequelizeModule.forFeature([User, Profile])
  ],
  controllers: [AuthController],
  providers: [AuthService, CommonService],
})
export class AuthModule {}
