import axios from "axios";
import { ICreateCallBody, ICreateCallResponse } from "../interfaces";
class VapiClient {
    public createCall= async(firstMessage: string) => {
        console.log("creando llamada");
        
        const headers = {
            'Authorization': `Bearer ${process.env.VAPI_PRIVATE_API_KEY}`,
            'Content-Type': 'application/json'
        };
        const data = {
           
        };
        try {
            const url = `${process.env.VAPI_URL}/call`;
            await axios.post(url, data, { headers });
            
        } catch (error : any) {
            throw new Error('Error while creating a Vapi call')
        }
    }
}
export const vapiClient = new VapiClient();