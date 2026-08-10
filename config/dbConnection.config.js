const mongoose = require("mongoose");

const dbConnection = async () =>{
    try{
        //connection

        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected Successfully!");
    }catch(err){
        console.log("MongoDB Connection Error: ", err)
        process.exit(1);
    }
};
module.exports= dbConnection;