import axios from "axios";
import { ICreateCallBody, ICreateCallResponse } from "../interfaces";
class VapiClient {
    public createCall= async(firstMessage: string) => {
        console.log("creando llamada");
        
        const headers = {
            'Authorization': `Bearer ${process.env.VAPI_PRIVATE_API_KEY}`,
            'Content-Type': 'application/json'
        };
        const data: ICreateCallBody = {
            type: "inboundPhoneCall",
            assistant: {
                transcriber: {
                    provider: "deepgram",
                    model: "nova-2",
                    language: "es"
                },
                model: {
                    temperature: 0.3,
                    provider: "openai",
                    model: "gpt-3.5-turbo"
                },
                serverMessages: [
                    "end-of-call-report"
                ],
                voice: {
                    inputPreprocessingEnabled: false,
                    provider: "azure",
                    voiceId: "andrew"
                },
                firstMessageMode: "assistant-speaks-first",
                recordingEnabled: true,
                maxDurationSeconds: 10,
                silenceTimeoutSeconds: 10,
                name: "TestitoName",
                firstMessage: firstMessage,
                serverUrl: `${process.env.BACK_URL}/api/v1/vapi/events`
            },
            customer: {
                number: "+543496460785",
                name: "German"
            },
            phoneNumber: {
                twilioPhoneNumber: "+543496460785",
                twilioAccountSid: "AC60ca9a2abc279a9fc0936d8d8ad9fda7",
                twilioAuthToken: "4ec5a9c037e75809f3c8652f5c88dbf3",
                name: "German"
            }
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