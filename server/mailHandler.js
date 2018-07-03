const nodemailer = require('nodemailer')


function sendEmail (mailSubject, mailHTML) {
    nodemailer.createTestAccount((error, account) => {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'craigslist.bot.bph@gmail.com',
                pass: process.env.EMAIL_PASS
            }
        })
    
        let mailOptions = {
            from: '<craigslistbot>',
            to: 'prescottbph@gmail.com',
            subject: mailSubject,
            html: mailHTML
        }
    
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error)
            }
            console.log('Message sent', info, info.messageId)
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
        })
    })
}

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
           user: 'youremail@address.com',
           pass: 'yourpassword'
       }
   });


module.exports = {
    sendEmail,
}

