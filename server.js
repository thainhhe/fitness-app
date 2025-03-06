const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "acquynho2000@gmail.com", // Thay bằng email thật của bạn
    pass: "qwlw fshx kssp pqaz", // Thay bằng App Password
  },
});

// API gửi email xác nhận đăng ký tài khoản
app.post("/send-verification", (req, res) => {
  const { email, code } = req.body;

  const mailOptions = {
    from: "acquynho2000@gmail.com",
    to: email,
    subject: "Xác thực tài khoản của bạn",
    text: `Mã xác thực của bạn là: ${code}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).send("Gửi email thất bại!");
    } else {
      res.send("Email xác thực đã được gửi!");
    }
  });
});

// API gửi mã đặt lại mật khẩu
app.post("/send-reset-code", (req, res) => {
  const { email, resetCode } = req.body;

  const mailOptions = {
    from: "acquynho2000@gmail.com",
    to: email,
    subject: "Đặt lại mật khẩu của bạn",
    text: `Mã xác thực để đặt lại mật khẩu của bạn là: ${resetCode}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Lỗi gửi email:", error);
      return res.status(500).send("Lỗi gửi email");
    }
    res.send("Email đặt lại mật khẩu đã được gửi!");
  });
});

app.listen(5001, () => {
  console.log("Email Server đang chạy trên cổng 5001");
});
