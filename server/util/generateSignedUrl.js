const { nanoid } = require("nanoid");
const { s3 } = require("../config/awsconfig");
const {getSignedUrl} = require("@aws-sdk/s3-request-presigner");
const { PutObjectCommand } = require("@aws-sdk/client-s3");

const generateSignedUrl = async ()=>{
    const date = new Date();
    const imgName = `${nanoid(8)}-${date.getTime()}.jpeg`
    const command = new PutObjectCommand({
        Bucket:"wavefront-blog",
        Key:imgName,
        ContentType:"image/jpeg"
    })
    const url = await getSignedUrl(s3,command,{expiresIn:15*60});
    return url;
};
const _getSignedUrl = async (req,res)=>{
    try{
        const url = await generateSignedUrl();
        res.status(200).json({uploadUrl:url});
    }catch(e){
        console.log(e);
        return res.status(500).json({error:"Something went wrong"});
    }
}
module.exports = {generateSignedUrl,_getSignedUrl};