const express=require ('express');
const app=express();
const connectdb=require('./db.js');
connectdb();
const cors=require('cors');
const Url=require('./models/url');
const urlrouter=require('./routes/url');
const authrouter=require('./routes/auth.js');
const authmiddleware=require('./middlewares/tokenverify.js');
app.use(express.json());

app.use(cors());

app.use('/urls',authmiddleware,urlrouter);
app.use('/authenticate',authrouter)

app.get('/r/:shortid',async (req,res)=>{
   
    try{
        const id=req.params.shortid;
        
        const doc=await Url.findOneAndUpdate({shortId:id},{$push:{visitHistory:Date.now()}},  { new: true } );
        if(!doc){
            return res.status(404).json({error:"No such id found"});
        }
        return res.status(200).redirect(`https://${doc.redirectUrl}`);
    }
    catch(e){
       return  res.status(500).json({error:e.message});
    }

})
const PORT=process.env.PORT || 5000;
app.listen(PORT,()=>{console.log(`Server listening on port ${PORT}`)});