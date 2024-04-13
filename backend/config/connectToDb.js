import mongoose from "mongoose";

async function connectToDb() {
    try{
        await mongoose.connect(process.env.DB_URL);
        console.log(`Connected to DB at port ${process.env.PORT}`);
    }
    catch(e) {
        console.log(`Database connection failed Error: ${e}`);
    }
}

export default connectToDb;