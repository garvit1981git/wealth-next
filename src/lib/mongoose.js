import mongoose from "mongoose"
// import dotenv from "dotenv";
// dotenv.config();
let Mongoosedb = async () => {

  try {
    console.log(process.env.MongoURL)
    await mongoose.connect(process.env.MongoURL)
  } catch (error) {
    console.log("this is error",error)
  }

}
export default Mongoosedb;
