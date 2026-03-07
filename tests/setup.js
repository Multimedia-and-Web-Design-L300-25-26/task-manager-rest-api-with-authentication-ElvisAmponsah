import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import connectDB from "../src/config/db.js";
import dotenv from "dotenv";

let mongoServer;

beforeAll(async () => {
    dotenv.config({ path: ".env.test" });
    mongoServer = await MongoMemoryServer.create();
    process.env.MONGO_URI = mongoServer.getUri();

    // Connect to the in-memory database
    await connectDB();
});

afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    }
    if (mongoServer) {
        await mongoServer.stop();
    }
});