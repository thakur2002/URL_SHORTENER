const express=require('express');
const router=express.Router();
const {shorturlgenerator,getprevurls,deleteUrl}=require('../controllers/url');

router.post('/',shorturlgenerator);
router.get('/',getprevurls);
router.delete('/:id',deleteUrl);
module.exports=router;

