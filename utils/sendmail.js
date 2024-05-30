var nodemailer = require('nodemailer');

module.exports = async function(email,otpgenerated){

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });
    
    var mailOptions = {
        from: 'markwithharsh@gmail.com',
        to: email,
        subject: 'Account Verification Otp',
        text: `Your OTP is ${otpgenerated}`
    };
    
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
            return error;
        } else {
            console.log('Email sent: ' + info.response);
            return info;
        }
    });

}
