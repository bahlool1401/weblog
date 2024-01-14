const nodeMailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");

const transporterDetails = smtpTransport({
    // host: "sendfrombhl@gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "sendfrombhl@gmail.com",
        pass: "09146764665bB@",
    },
    tls: {
        rejectUnauthorized: false,
    },
});

const transporter = nodeMailer.createTransport(transporterDetails);

const options = {
    from: "sendfrombhl@gmail.com",
    to: "bahlool.ramesh@gmail.com",
    subject: "Nodemailer",
    text: "this is the simple test of NODE MAILER",
};

transporter.sendMail(options, (err, info) => {
    if (err) return console.log(err);
    console.log(info);
});
