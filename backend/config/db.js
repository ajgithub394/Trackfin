const mongoose = require("mongoose");
const connectDB = async () =>{
    try{
        await mongoose.connect(process.env.MONGO_URI,{});
        console.log("Connected to database");
    }
    catch(err){
        console.error("Problem connecting to database",err);
        process.exit(1);
    }
};

module.exports = connectDB;