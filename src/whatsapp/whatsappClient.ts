import WAWebJS, { Client, RemoteAuth } from 'whatsapp-web.js';
import { superAgentClient } from '../superagent/superAgent';
import { MongoStore } from 'wwebjs-mongo';
import mongoose from 'mongoose';
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

        // when the client is ready
        this.client.once('ready', () => {
            console.log('Client is ready!');
            this.setIsConnected(true);
        });

        // when the client saved the remote session
        this.client.on('remote_session_saved', () => {
            console.log("Session saved to the database");
        });

        // when the client is authenticated
        this.client.on('authenticated',()=>{
            console.log("Authenticated");
            
        })
        
        // when the client receives a message
        this.client.on('message', async (message) => {
           await this.handleMessage(message)
        });
       
        // when the clients disconnects
        this.client.on('disconnected', (reason) => {
            console.log('Client was logged out', reason);
            this.setIsConnected(false);
            this.reconnectClient();
        });

        // when the client authentication fails
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
            const agentId = "001049c4-bccc-420d-a432-b9b7b1c03508";
                
            let messageObject :IMessage = {
                type: 'human',
                content: message.body,
                additional_kwargs:{},
                name: null,
                example: false
            };

            try {
                // If no document exists in the DB, create one; otherwise, update the existing document.
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
                        // updates the document with the new messages
                        const chatHistoryWithAiMessage = await chatHistoryService.updateChatHistory(message.from,agentId,aiResponseObject)

                        // the agent sends a follow up message based on a simple condition.
                        if(chatHistoryWithAiMessage.history.length === 6){
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
                        // updates the document with the new messages
                        await chatHistoryService.updateChatHistory(message.from,agentId,aiResponseObject2)
                        }
                    } catch (error) {
                        throw new Error('Error updating chat history in MongoDB');
                    }
                } catch (error) {
                    throw new Error('Error in the superAgent');
                }
            } catch (error) {
                throw new Error('Error updating chat history in MongoDB');
            }
           
        } catch (error) {
            throw new Error('Failed to send the message');
        }

    }

    // method to reconnect the client
    private reconnectClient() {
        console.log('Attempting to reconnect...');
        // Destroy the current client instance
        this.client.destroy();
        // Reinitialize the client
        this.client.initialize();
        this.setIsConnected(false);

        // when the client is ready again
        this.client.once('ready', () => {
            console.log('Client reconnected!');
            this.setIsConnected(true);
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

    // method to generate a qr
    public async generateQr(): Promise<string> {
        return new Promise(( resolve, reject ) => {
            this.client.once('qr', (qr) => {
                resolve(qr);
            });
        });
    }

}

export const whatsAppClient = new WhatsAppClient()
