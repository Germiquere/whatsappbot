import { SuperAgentClient } from "superagentai-js";
import dotenv from "dotenv"

interface InvokeResponse {
    success: boolean;
    data: {
      input: string;
      chat_history: any[];
      output: string;
    };
  }

export class superAgentClient{
    private superAgent = new SuperAgentClient({
        token: process.env.API_TOKEN,
        environment: process.env.CAAI_URL
    })
    
    constructor(){}

    public invoke = async( input:string, agentId:string ,sessionId :string) => {
        try {
            // "3ac43c75-a6ca-48ed-828e-ff6084084942"
            const output =  await this.superAgent.agent.invoke(agentId,{
                input,
                enableStreaming: false,
                sessionId
            })
            
            const data =  output as InvokeResponse

            // console.log(data.data.chat_history);
            // const agents = await this.superAgent.agent.list()
            // const filteredAgent = agents.data?.filter((agent) => agent.id === "1883d7d3-6ac4-4e60-82d0-90a2737436b0")
            // console.log(filteredAgent);
            
            
            return data
        
        } catch (error) {
            console.log("Error invoking:",error);
            throw new Error('Error invoking');
            
        }
    }
}