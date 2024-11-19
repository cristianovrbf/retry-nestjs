import { Module } from '@nestjs/common';
import { ConsumerV1Controller } from './presentation/controllers/v1/consumer.controller';
import {IConsumerProxyProvider} from './domain/providers/consumer-proxy-service.interface'
import { ConsumerProxyService } from './infrastructure/providers/consumer-proxy-service';
import { ConsumeExternalServiceUseCase } from './application/usecases/consume-external-service';

@Module({
  imports: [],
  controllers: [
    ConsumerV1Controller
  ],
  providers: [
    {
      provide: 'IConsumerProxyProvider',
      useClass: ConsumerProxyService
    },
    {
      provide: ConsumeExternalServiceUseCase,
      useFactory: (proxy: IConsumerProxyProvider) => {
        return new ConsumeExternalServiceUseCase(proxy)
      },
      inject: ['IConsumerProxyProvider']
    }
  ],
})
export class AppModule {}
