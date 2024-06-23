import { whatsAppClient } from "../whatsapp/whatsappClient"

class WhatsappService{
    // method to generate the qr and a timestamp with the expiration time
    public generateQr = async () => {
        try {
            const qr = await whatsAppClient.generateQr();
            // it creates an expiration time in miliseconds
            const expirationTime = Date.now() + 30000;
            return {
                qr,
                expirationTime
            }
            
        } catch (error) {
            throw new Error("Error generating the qr")
        }

    }
}
export const whatsappService = new WhatsappService()