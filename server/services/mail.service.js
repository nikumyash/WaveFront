const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service:'gmail',
    host:'smtp.gmail.com',
    port:587,
    secure:false,
    auth:{
        user:process.env.MAIL_USER,
        pass:process.env.MAIL_PASSWORD
    }
});


const sendLoginMail = (transporter,mailAddr,token)=>{
    const tokenLink ="http://localhost:5173/auth?token="+token;
    const MailOpts = {
        from:{
            name:"Wavefront",
            address:"mail@wavefront.com"
        },
        to:mailAddr,
        subject:'Login',
        text:`Click on the link here to login ${tokenLink}.`,
    }
    transporter.sendMail(MailOpts,(err,g)=>{
        if(err){
            console.log("Error:" ,err);
        }
        else console.log("Sent");
    })
}
const sendSignupMail = (transporter,mailAddr,token)=>{
    const tokenLink ="http://localhost:5173/auth?token="+token;
    const MailOpts = {
        from:{
            name:"Wavefront",
            address:"mail@wavefront.com"
        },
        to:mailAddr,
        subject:'Welcome',
        text:`Thank you for signing up. Click on the link to verify your account ${tokenLink}`,
    }
    transporter.sendMail(MailOpts,(err,g)=>{
        if(err){
            console.log("Error:" ,err);
        }
        else console.log("Sent");
    })
}
const sendChangeMailMail = (transporter,mailAddr,token)=>{
    const tokenLink ="http://localhost:5173/changemail?token="+token;
    const MailOpts = {
        from:{
            name:"Wavefront",
            address:"mail@wavefront.com"
        },
        to:mailAddr,
        subject:'Change Mail',
        text:`Click on the following link to change your mail ${tokenLink}`,
    }
    transporter.sendMail(MailOpts,(err,g)=>{
        if(err){
            console.log("Error:" ,err);
        }
        else console.log("Sent");
    })
}

module.exports = {transporter,sendLoginMail,sendSignupMail,sendChangeMailMail};