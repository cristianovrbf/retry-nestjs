import { ConsumeExternalServiceOutput } from "@/application/usecases/consume-external-service";
import { IConsumerProxyProvider } from "@/domain/providers/consumer-proxy-service.interface";
import axios from "axios";

export class ConsumerProxyService implements IConsumerProxyProvider{

    constructor(){}


    async consume(): Promise<ConsumeExternalServiceOutput> {
        const response = await axios.get("http://localhost:3001/");

        return {
            success: response.data.success,
            data: response.data.data
        }
    }

    
}