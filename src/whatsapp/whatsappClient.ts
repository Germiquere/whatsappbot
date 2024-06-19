import WAWebJS, { Client, RemoteAuth } from 'whatsapp-web.js';
import { superAgentClient } from '../superagent/superAgent';
import { MongoStore } from 'wwebjs-mongo';
import mongoose from 'mongoose';
import qrcode from 'qrcode-terminal';
import { chatHistoryService } from '../services/chatHistory.service';
import { IMessage } from '../models/chatHistory.model';

class WhatsAppClient {
    private client: Client;
    private isConnected: boolean = false; // connextion status;

    constructor() {
        // Load the session data
        const store = new MongoStore({ mongoose: mongoose });

        this.client = new Client({
            authStrategy: new RemoteAuth({
                store: store,
                backupSyncIntervalMs: 300000,
            }),
            webVersionCache: {
                type: "remote",
                remotePath: "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html",
            },
        });

        this.initializeEventHandlers();
    }

    // method to initialize client's events
    private initializeEventHandlers() {
        this.client.once('ready', () => {
            console.log('Client is ready!');
            this.setIsConnected(true);

            // Simulate a disconnection after 2 minutes
            // setTimeout(() => {
            //     console.log('Simulating disconnection...');
            //     this.client.emit('disconnected', 'Simulated disconnection');
            // }, 120000); // 2 minutes
        });

        this.client.on('remote_session_saved', () => {
            console.log("Session saved to the database");
        });

        this.client.on('qr', (qr) => {
            qrcode.generate(qr, { small: true });
        });

        this.client.on('authenticated',()=>{
            console.log("Authenticated");
            
        })
        
        // TODO: change 'message_create' to 'message'
        this.client.on('message', async (message) => {
           await this.handleMessage(message)
        });
       
        

        this.client.on('disconnected', (reason) => {
            console.log('Client was logged out', reason);
            this.setIsConnected(false);
            this.reconnectClient();
        });

        this.client.on('auth_failure', (message) => {
            console.error('Authentication failure:', message);
            this.setIsConnected(false);
            this.reconnectClient();
        });

        
    }

    // method to handle messages
    private async handleMessage(message :WAWebJS.Message) {

        console.log("Received message:",message.from, message.body);

        try {
            if (message.body === "simulateErrorMessage") {
                await this.client.sendMessage('phonenumber', "hola");
            }
            else if(message.from === "5493496524533@c.us" || message.from === "5493496468307@c.us"){
                // const agentId = "3ac43c75-a6ca-48ed-828e-ff6084084942";
                const agentId = "001049c4-bccc-420d-a432-b9b7b1c03508";
                
                let messageObject :IMessage = {
                    type: 'human',
                    content: message.body,
                    additional_kwargs:{},
                    name: null,
                    example: false
                };

                try {
                    const chatHistory = await chatHistoryService.updateChatHistory(message.from, agentId, messageObject);
                    
                    try {
                        const superAgent = new superAgentClient();
                        let output = await superAgent.invoke(JSON.stringify(chatHistory.history), chatHistory.agentId,message.from);
                        message.reply(output.data.output);
                        let aiResponseObject:IMessage = {
                            type: 'ai',
                            content: output.success ? output.data.output : 'Lo siento, no pude procesar tu solicitud en este momento.',
                            additional_kwargs:{},
                            name:null,
                            example:false
                        };
                        try {
                            // TODO: refator following DRY principle.
                           const chatHistoryWithAiMessage = await chatHistoryService.updateChatHistory(message.from,agentId,aiResponseObject)
                           if(chatHistoryWithAiMessage.history.length === 6){
                            console.log("estoy por mandar el customInput");
                            
                            const customInput = `Primero, revisa y analiza la siguiente conversacion de un cliente interesado en nuestros autos:${JSON.stringify(chatHistoryWithAiMessage.history)}.Segundo, crea un mensaje de seguimiento que pregunte si la infomacion fue util y ofrece mas ayuda. (Envia solo el mensaje con la informacion util y ofreciendo mas ayuda)`
                            const newOutput = await superAgent.invoke(customInput,chatHistoryWithAiMessage.agentId,message.from);
                            message.reply(newOutput.data.output);
                            let aiResponseObject2:IMessage = {
                                type: 'ai',
                                content: newOutput.success ? newOutput.data.output : 'Lo siento, no pude procesar tu solicitud en este momento.',
                                additional_kwargs:{},
                                name:null,
                                example:false
                            };
                            await chatHistoryService.updateChatHistory(message.from,agentId,aiResponseObject2)
                           }
                        } catch (error) {
                            console.error('Error updating chat history in MongoDB:', error);
                        }
                    } catch (error) {
                        console.error('Error in the superAgent:', error);
                    }
                } catch (error) {
                    console.error('Error updating chat history in MongoDB:', error);
                }
            }
        } catch (error) {
            console.log("Failed to send the message:", error);
            // if (attempt >= this.max_retries) {
            //     console.log("Maximum retry attempts reached. Failed to process the message.");
            // }
        }
        
    }

    private reconnectClient() {
        console.log('Attempting to reconnect...');
        this.client.destroy(); // Destroy the current client instance
        this.client.initialize(); // Reinitialize the client
        this.setIsConnected(false);

        this.client.once('ready', () => {
            console.log('Client reconnected!');
            this.setIsConnected(true);
            // TODO: add queed messages
        });
    }

    // method to set the connection status
    private setIsConnected(status: boolean) {
        this.isConnected = status;
    }

    // method to initialize the client
    public init() {
        this.client.initialize();
    }
}

export const whatsAppClient = new WhatsAppClient()
