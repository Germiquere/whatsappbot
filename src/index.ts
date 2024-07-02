import express, { Application } from 'express';
import dotenv from "dotenv"
import cors from "cors";
import { mongoDb } from "./database/database";
import { whatsAppClient } from './whatsapp/whatsappClient';
import whatsappWebRoutes from './routes/whatsapp-web.routes';
import vapiRoutes from './routes/vapi.routes';
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
        this.app.use(cors());
        this.app.use(express.json())
        mongoDb.connect().then(() => {
            console.log("Database connected");
            whatsAppClient.init()
        }).catch(err => {
            console.error("Database connection error:", err);
        });

		
	}

    // method for the routes
    routes(){
        this.app.get("/", (req, res) => {
            res.send("Hi there");
          });
        
        this.app.use("/api/v1/whatsapp-web",whatsappWebRoutes);
        this.app.use("/api/v1/vapi",vapiRoutes);

    }

    // method to start the app
    start(){
        this.app.listen(this.app.get("port"), () => {
            console.log("Server on port", this.app.get("port"));
          });
	}

}

const server = new Server();
server.start()