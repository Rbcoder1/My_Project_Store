import mongoose from 'mongoose';
import { DATABASE_NAME } from '../constant.js'

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.DATABASE_URI}/${DATABASE_NAME}`);
        console.log(`\n mongodb connected !! DB HOST : ${connectionInstance.connection.host}`);
    }
    catch (error) {
        console.log("MONGODB connection error", error);
        process.exit(1);
    }
}

export default connectDB;