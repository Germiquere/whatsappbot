import { Client, RemoteAuth } from 'whatsapp-web.js';
import { MongoStore } from 'wwebjs-mongo';
import mongoose from 'mongoose';
import qrcode from 'qrcode-terminal';

class WhatsAppClient {
    private client: Client;

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

            // Simulate a disconnection after 2 minutes
            setTimeout(() => {
                console.log('Simulating disconnection...');
                this.client.emit('disconnected', 'Simulated disconnection');
            }, 120000); // 2 minutes
        });

        this.client.on('remote_session_saved', () => {
            console.log("Session saved to the database");
        });

        this.client.on('qr', (qr) => {
            qrcode.generate(qr, { small: true });
        });

        this.client.on('message_create', (message) => {
            console.log(message);
            console.log(message.body);
            if (message.body === "Precio") {
                message.reply('Cada sambuche sale $4800');
            } else {
                console.log("pepe");
            }
        });

        this.client.on('disconnected', (reason) => {
            console.log('Client was logged out', reason);
            this.reconnectClient();
        });
    }

    // method to reconnect the client
    private reconnectClient() {
        console.log('Attempting to reconnect...');
        this.client.destroy(); // Destroy the current client instance
        this.client.initialize(); // Reinitialize the client
    }

    // method to initialize the client
    public init() {
        this.client.initialize();
    }
}

export const whatsAppClient = new WhatsAppClient()
