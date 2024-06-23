import { Request, Response } from "express";
import { whatsappService } from "../services/whatsapp-web.service";

class WhatsappController{
    // method to get a qr code
    public getQr = async ( req: Request, res: Response ) => {
        try {
            const qr = await whatsappService.generateQr()
            return res.status(201).json({
                title:"Successful operation",
                message:"Qr genered successfully!",
                data:qr,
            })
        } catch (error:any) {
            return res.status(500).json({
                title:"Operation failed",
                message:error.message
            })
        }
       
    }
}
export const whatsappController = new WhatsappController()