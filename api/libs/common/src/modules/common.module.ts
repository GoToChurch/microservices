import {ConfigModule, ConfigService} from "@nestjs/config";

import {DynamicModule, Module} from "@nestjs/common";
import {ClientProxyFactory, ClientsModule, Transport} from "@nestjs/microservices";
import {CommonService} from "@app/common/services/common.service";

interface CommonModuleOptions {
    name: string;
}

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: './.env',
        }),
    ],
    providers: [CommonService, ConfigService],
    exports: [CommonService],
})
export class CommonModule {

    static registerRmq({ name }: CommonModuleOptions): DynamicModule {
        return {
            module: CommonModule,
            imports: [
                ClientsModule.registerAsync([
                    {
                        name,
                        useFactory: (configService: ConfigService) => ({
                            transport: Transport.RMQ,
                            options: {
                                urls: [configService.get<string>('RABBIT_MQ_URI')],
                                queue: configService.get<string>(`RABBIT_MQ_${name}_QUEUE`),
                                queueOptions: {
                                    durable: true, // queue survives broker restart
                                },
                            },
                        }),
                        inject: [ConfigService],
                    },
                ]),
            ],
            providers: [ConfigService],
            exports: [ClientsModule, ConfigService],
        };
    }
}