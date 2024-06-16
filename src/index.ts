import express, { Application } from 'express';
import dotenv from "dotenv"
import {SuperAgent, SuperAgentClient,SuperAgentError} from "superagentai-js";
import { mongoDb } from "./database/database";
import { whatsAppClient } from './whatsapp/whatsappClient';
dotenv.config()

class Server{

    public app: Application;

    constructor(){
        this.app = express()
        this.config()
        this.routes()
    }

    // main config
    config(){
        this.app.set("port", process.env.PORT || 4000)
        mongoDb.connect().then(() => {
            console.log("Database connected");
            whatsAppClient.init()
        }).catch(err => {
            console.error("Database connection error:", err);
        });

		
	}

    routes(){
        this.app.get("/", (req, res) => {
            res.send("Hi there");
          });
    }

    start(){
        this.app.listen(this.app.get("port"), () => {
            console.log("Server on port", this.app.get("port"));
          });
	}

}

const server = new Server();
server.start()