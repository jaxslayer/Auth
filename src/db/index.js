import mongoose from "mongoose";
import { DB_Name } from "../constants.js";
const connectDb = async () => {
  try {
    const connectionintance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DB_Name}`
    );
    console.log(
      `MongoDb connected !! db host:${connectionintance.connection.host}`
    );
  } catch (error) {
    console.log(`MongoDb Connection Failed :${error}`);
    process.exit(1);
  }
};

export default connectDb;
