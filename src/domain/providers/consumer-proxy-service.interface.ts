import { ConsumeExternalServiceOutput } from "@/application/usecases/consume-external-service";

export interface IConsumerProxyProvider{
    consume(): Promise<ConsumeExternalServiceOutput>;
}