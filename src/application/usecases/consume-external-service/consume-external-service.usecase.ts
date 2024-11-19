import { IConsumerProxyProvider } from "@/domain/providers/consumer-proxy-service.interface";
import { ConsumeExternalServiceOutput } from "./consume-external-service.output";

export class ConsumeExternalServiceUseCase{

    constructor(
        private readonly proxy: IConsumerProxyProvider
    ){}

    async handle(): Promise<ConsumeExternalServiceOutput>{

        const data = await this.proxy.consume();

        return data;
    }
}