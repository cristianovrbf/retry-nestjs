import { ConsumeExternalServiceUseCase } from "@/application/usecases/consume-external-service";
import { Controller, Get, UseInterceptors } from "@nestjs/common";


@Controller()
export class ConsumerV1Controller{

    constructor(
        private readonly consumeExternalServiceUseCase: ConsumeExternalServiceUseCase
    ){}

    @Get()
    async consume(){
        return await this.consumeExternalServiceUseCase.handle();
    }
}