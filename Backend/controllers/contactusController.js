
var nodemailer = require('nodemailer');

const contactusController = {};

// transporter for sending mail 
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ayushpatel062004@gmail.com',
        pass: 'hiok hpiz nrib crqq'
    }
});


// ----------------------------------------------for sending otp  for new password--------------------------------------------------

contactusController.contact = async (req,res) => {
    const {name , email , subject , message}  = req.body;
     
    var mailOptions = {
        from: 'ayushpatel062004@gmail.com',
        to: `kamliyahemant78@gmail.com`,
        subject:subject,
        text: `${message} 
        by : ${name}
        sender mail : ${email}`
    };
    try {
        transporter.sendMail(mailOptions, function (error, info) {
                if (!error) {
                    res.send({
                        status:"Ok",
                        msg:"mail send to author",
                        data:[]
                    })
                } else {
                    res.send({
                        status:"ERR",
                        msg:"error at server",
                        data:[]
                    })
                }
            });
        }

    catch (err) {
        return {
            status: "err",
            msg: "error occured in password service",
            data: err
        }
    }
}

module.exports = contactusController
