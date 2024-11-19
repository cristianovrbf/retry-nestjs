import { ConsumeExternalServiceUseCase } from "@/application/usecases/consume-external-service";
import { RetryInterceptor } from "@/infrastructure/interceptors/retry.interceptor";
import { Controller, Get, UseInterceptors } from "@nestjs/common";


@Controller()
@UseInterceptors(RetryInterceptor)
export class ConsumerV1Controller{

    constructor(
        private readonly consumeExternalServiceUseCase: ConsumeExternalServiceUseCase
    ){}

    @Get()
    async consume(){
        return await this.consumeExternalServiceUseCase.handle();
    }
}