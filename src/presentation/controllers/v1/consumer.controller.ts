import { ConsumeExternalServiceUseCase } from "@/application/usecases/consume-external-service";
import { CircuitBreakerInterceptor } from "@/infrastructure/interceptors/circuit-breaker.interceptor";
import { Controller, Get, UseInterceptors } from "@nestjs/common";


@Controller()
@UseInterceptors(CircuitBreakerInterceptor)
export class ConsumerV1Controller{

    constructor(
        private readonly consumeExternalServiceUseCase: ConsumeExternalServiceUseCase
    ){}

    @Get()
    async consume(){
        return await this.consumeExternalServiceUseCase.handle();
    }
}