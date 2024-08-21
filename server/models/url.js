const mongoose=require("mongoose");
const urlschema=new mongoose.Schema({
    shortId:{
        type:String,
        required:true,
        unique:true
    },
    redirectUrl:{
        type:String,
        required:true,
    },
    user:{
        type:String,
        required:true
    },
    // visitHistory:[{timestamps:{type:Number}}],
    visitHistory: [{
        type: Date
    }]    
    
},{timestamps:true}
);

module.exports=mongoose.model("Url",urlschema);