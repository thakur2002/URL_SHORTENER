  const mongoose=require('mongoose');
  require('dotenv').config();

  async  function connectdb(){
    const mongouri=process.env.dbconnectionstring;
    try{
        await mongoose.connect(mongouri);
       const db=mongoose.connection;
       db.on('connected',()=>console.log("connected to mongodb"));
       db.on('error',()=>console.log("error"));
       db.on('disconnected',()=>console.log("disconnected from mongodb"));
    }
    catch(err){
        console.error(err.message);
        process.exit(1);
    } 
  }

  module.exports=connectdb;
