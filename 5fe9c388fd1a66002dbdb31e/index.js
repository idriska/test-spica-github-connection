var Filter = require("bad-words");
const nodemailer = require("nodemailer");

export default function(changes) {
    var filter = new Filter();

    var comment = changes.current.comment;

    console.log(comment);

    if (comment !== filter.clean(comment)) {
        sendMail("example@example.com", comment);
    }

    return;
}

async function sendMail(email, comment) {
    let account = await nodemailer.createTestAccount();
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: account.user, // generated ethereal user
            pass: account.pass // generated ethereal password
        }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: "admin@spicaengine.com",
        to: email,
        subject: "Comment posted that contains a bad words",
        text: `
                The comment contain a bad words.

                Comment:
                ${comment}
            `
    });

    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

export async function test(req,res){
    console.log("asdasd");
    res.status(200).send("OK");
}