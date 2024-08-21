
const Url=require('../models/url');


async function shorturlgenerator(req,res){
    try{
        const shortid=Math.random().toString(36).substring(2,6);
        const redirecturl=req.body.url;
        if(!redirecturl){
          return res.status(400).json({error:"Give a valid url"});
        }
        await Url.create({
         shortId:shortid,
         redirectUrl:redirecturl,
         visitHistory:[],
         user:req.user.username
        })
        return res.status(201).json({shortid});
    }
   catch(e){
       return res.status(500).json({error:e.message});
   }
}
async function getprevurls(req,res){
    try{
        const docs=await Url.find({user:req.user.username});
        return  res.status(200).json({entries:docs});
    }
   catch(e){
        return res.status(500).json({error:e.message});
   }
}

async function deleteUrl(req,res){
    try{
        
        const url=await Url.findByIdAndDelete(req.params.id);
        if(!url){
            console.log("Item to be deleted not found");
           return res.status(404).json({success:false});
        }
        return res.status(200).json({success:true});
    }
    catch(e){
       return  res.status(500).json({success:false,error:e.message});
    }
}
module.exports={
    shorturlgenerator,getprevurls,deleteUrl
}