import { Request, Response } from "express"
import { vapiService } from "../services/vapi.service"

class VapiController {
    // websocket method
    public endOfCallReport = async ( req: Request, res: Response ) => {
        try {
            await vapiService.endOfCallReport(req)
            return res.sendStatus(200);
        } catch (error:any) {
            return res.status(500).json({
                title:"Operation failed",
                message:error.message
            })
        }
       
    }
}
export const vapiController = new VapiController()