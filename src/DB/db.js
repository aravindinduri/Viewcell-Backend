import mongoose from "mongoose";


const connectDB = async () => {
    try {
       const ConnectInstance = await mongoose.connect(`${process.env.MONGODB_URL}`)
        console.log(` \n MongoDB Connected DB Host !!1:${ConnectInstance.connection.host}`);

    } catch (error) {
        console.log(`Error in proccesing`,error);
        process.exit(1);
    }
}

export default connectDB;