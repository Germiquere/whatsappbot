import { SuperAgentClient } from "superagentai-js";

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
    
    // method to invoke the agent
    public invoke = async( input:string, agentId:string ,sessionId :string) => {
        try {
            const output =  await this.superAgent.agent.invoke(agentId,{
                input,
                enableStreaming: false,
                sessionId
            })
            
            const data =  output as InvokeResponse;
            return data
        
        } catch (error) {
            throw new Error('Error invoking the agent');
            
        }
    }
}