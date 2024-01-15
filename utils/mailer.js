const nodeMailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");

const transporterDetails = smtpTransport({
    host: "bahloulramesh.ir",
    port: 465,
    secure: true,
    auth: {
        user: "test1402@bahloulramesh.ir",
        pass: "09146764665bB@",
    },
    tls: {
        rejectUnauthorized: false,
    },
});

// const transporter = nodeMailer.createTransport(transporterDetails);

// const options = {
//     from: "sendfrombhl@gmail.com",
//     to: "bahlool.ramesh@gmail.com",
//     subject: "Nodemailer",
//     text: "this is the simple test of NODE MAILER",
// };

// transporter.sendMail(options, (err, info) => {
//     if (err) return console.log(err);
//     console.log(info);
// });

exports.sendMail=(email,fullname,subject,message)=>{
    const transporter = nodeMailer.createTransport(transporterDetails);
    transporter.sendMail({
        from:"test1402@bahloulramesh.ir",
        to:email,
        subject:subject,
        html:`<h1> سلام ${fullname}</h1>
        <p>${message}</p>
        `
    })
}
