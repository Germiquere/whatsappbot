import { Router } from "express";
import { vapiController } from "../controllers/vapi.controller";


class VapiRoutes {
    public router: Router = Router();
    constructor() {
        this.config();
    }
    config(){
        this.router.post("/events",vapiController.endOfCallReport);
    }
}
const vapiRoutes = new VapiRoutes();
export default vapiRoutes.router;