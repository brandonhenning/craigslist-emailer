const nodemailer = require('nodemailer')


function sendEmail (mailSubject, mailHTML) {
    nodemailer.createTestAccount((error, account) => {
        let transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: account.user,
                pass: account.pass
            }
        })
    
        var mailOptions = {
            from: '<brandon@example.com>',
            to: 'test@gmail.com',
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


module.exports = {
    sendEmail,
}

