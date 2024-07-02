// import { Request } from "express";
// import axios from "axios";
// import path from "path";
// import fs from 'fs';
// import EventEmitter from "events";

// class VapiService extends EventEmitter{
//     public endOfCallReport = async ( req :Request ) =>{
//         try {
//             const event = req.body
//             if (event.message && event.message.type === 'end-of-call-report'){
//                 console.log("LLamada  finalizada");
//                 // const recordingUrl = event.message.recordingUrl
//                 const recordingUrl = 'https://auth.vapi.ai/storage/v1/object/public/recordings/56489d32-3c17-4b0b-971f-857fbb8e5f8d-1719584164130-3a8e0f60-ebab-424b-b66b-6ef3288a4cf4-mono.wav'

//                 const fileName = path.basename(recordingUrl);
//                 const tempDir = path.resolve(__dirname,'..', 'temp');
//                 if (!fs.existsSync(tempDir)) {
//                     fs.mkdirSync(tempDir);
//                 }
//                 const filePath = path.resolve(tempDir,fileName)
//                 const response = await axios({
//                     method: 'get',
//                     url: recordingUrl,
//                     responseType: 'stream'
//                 });
                
//                 const writer = fs.createWriteStream(filePath);
//                 response.data.pipe(writer);

//                 await new Promise((resolve, reject) => {
//                     writer.on('finish', resolve);
//                     writer.on('error', reject);
//                 });

//                 const audioData = fs.readFileSync(filePath);

//                 // Emit an event when the audio file is ready
//                 this.emit('audioReady', { fileName, audioData });
//             }
            
//         } catch (error) {
//             this.emit('audioError', error);
//             throw new Error("Error generating the audio file")
//         }
        
//     }
// }

// export const vapiService = new VapiService()

import { Request } from "express";
import axios from "axios";
import path from "path";
import fs from 'fs';
import EventEmitter from "events";
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';

class VapiService extends EventEmitter {
    public endOfCallReport = async (req: Request) => {
        try {
            const event = req.body;
            if (event.message && event.message.type === 'end-of-call-report') {
                console.log("Llamada finalizada");
                // TODO: check why i am not getting the first message of the assistant recorded. The audio file for now comes but it has no audio because the assistant voice is not getting recorded.
                // const recordingUrl = event.message.recordingUrl

                // this hardcoded url is just for testing purposes!!.
                const recordingUrl = 'https://auth.vapi.ai/storage/v1/object/public/recordings/56489d32-3c17-4b0b-971f-857fbb8e5f8d-1719584164130-3a8e0f60-ebab-424b-b66b-6ef3288a4cf4-mono.wav';

                const fileName = path.basename(recordingUrl, path.extname(recordingUrl));
                
                const tempDir = path.resolve(__dirname, '..', 'temp');

                if (!fs.existsSync(tempDir)) {
                    fs.mkdirSync(tempDir);
                }

                const filePath = path.resolve(tempDir, `${fileName}.wav`);
                const oggFilePath = path.resolve(tempDir, `${fileName}.ogg`);

                const response = await axios({
                    method: 'get',
                    url: recordingUrl,
                    responseType: 'stream'
                });

                const writer = fs.createWriteStream(filePath);
                response.data.pipe(writer);

                await new Promise((resolve, reject) => {
                    writer.on('finish', resolve);
                    writer.on('error', reject);
                });

                // Convert WAV to OGG using ffmpeg in order whatsapp-web.js to work properly while sending audio files
                await new Promise((resolve, reject) => {
                    ffmpeg(filePath)
                        .setFfmpegPath(ffmpegStatic!)
                        .audioCodec('libopus')
                        .toFormat('ogg')
                        .on('end', resolve)
                        .on('error', reject)
                        .save(oggFilePath);
                });

                const audioData = fs.readFileSync(oggFilePath);

                fs.unlink(filePath,(error)=>{
                    if(error){
                        throw new Error('Error deleting the audio file');
                    }
                })
                // Emit an event when the audio file is ready
                this.emit('audioReady', { fileName: `${fileName}.ogg`, audioData });
            }
        } catch (error) {
            this.emit('audioError', error);
            throw new Error("Error generating the audio file");
        }
    }
}

export const vapiService = new VapiService();
