import mongoose from "mongoose";

class MongoDb {
    // method to connect the database
    public async connect() {
        try {
            await mongoose.connect(process.env.MONGO_URL!);
            console.log("DB is connected");
        } catch (err) {
            console.error("DB connection error:", err);
            throw err;
        }
    }
}

export const mongoDb = new MongoDb();