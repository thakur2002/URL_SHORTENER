
const Url=require('../models/url');
const md5=require('md5');

const base62Chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
function base62encode(num) {
    let result = '';
    while (num > 0) {
        result = base62Chars[num % 62] + result;
        num = Math.floor(num / 62);
    }
    return result || '0';
}
async function shorturlgenerator(req,res){
    try{
        // const shortid=Math.random().toString(36).substring(2,6);
        
        let redirecturl=req.body.url;
        if(!redirecturl){
            return res.status(400).json({error:"Give a valid url"});
          }

        if (redirecturl.substring(0, 8) === "https://") {
            redirecturl = redirecturl.substring(8);
        } else if (redirecturl.substring(0, 7) === "http://") {
            redirecturl = redirecturl.substring(7);
        }

        const existingUrl = await Url.findOne({ redirectUrl: redirecturl });
        if(existingUrl){
            return res.status(409).json({error:"Shortened url already exist for this long url!"});
        }
        
         // Generate MD5 hash
        const md5Hash = md5(redirecturl);

        // Take the first 6 bytes (12 characters) from the hash
        const shortHash = md5Hash.substring(0, 9);

        // Convert the hash portion to Base62
        const shortid = base62encode(parseInt(shortHash, 16));
       
        
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