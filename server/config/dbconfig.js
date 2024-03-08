const mongoose = require('mongoose');

const connectDB = async ()=>{
    try{    
        await mongoose.connect(process.env.MONGO_URI,{autoIndex:true});
        console.log("Mongo client connected");
    }catch(e){
        console.error(e);
    }
};

module.exports = connectDB