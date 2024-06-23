import { Router } from "express";
import { whatsappController } from "../controllers/whatsapp-web.controller";


class WhatsappRoutes {
    public router: Router = Router();
    constructor() {
        this.config();
    }
    config(){
        this.router.get("/generate-qr",whatsappController.getQr);
    }
}
const whatsappRoutes = new WhatsappRoutes();
export default whatsappRoutes.router;