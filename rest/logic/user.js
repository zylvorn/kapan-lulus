import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createTransport } from "nodemailer";

import sender from "./response-sender";
import datalayer from "../datalayers/user/user";

let senderMail = "kapanlulus2019@gmail.com";
const transporter = createTransport({
  service: "gmail",
  auth: {
    user: senderMail,
    pass: "ayamgoreng"
  }
});

export default {
  getData: (req, res) => {
    console.log(`GET: ${req.protocol}://${req.get("host")}${req.originalUrl}`);
    datalayer
      .getData()
      .then(data => {
        sender(res, 200, data);
      })
      .catch(err => sender(res, 404, err));
  },
  createData: (req, res) => {
    console.log(`POST: ${req.protocol}://${req.get("host")}${req.originalUrl}`);
    datalayer.getByUsername(req.body.username).then(dataUser => {
      if (dataUser.length === 0) {
        bcrypt.genSalt(10, (_, salt) => {
          bcrypt.hash(req.body.password, salt, (_, hash) => {
            datalayer
              .createData(Object.assign({}, req.body, { password: hash }))
              .then(data => {
                sender(res, 200, data);
              })
              .catch(err => sender(res, 404, err));
          });
        });
      } else {
        sender(res, 400, "Username already used by other user");
      }
    });
  },
  editData: (req, res) => {
    console.log(`PUT: ${req.protocol}://${req.get("host")}${req.originalUrl}`);
    datalayer
      .updateData(req.params.id, req.body)
      .then(data => {
        sender(res, 200, data);
      })
      .catch(err => sender(res, 404, err));
  },
  login: (req, res) => {
    console.log(`POST: ${req.protocol}://${req.get("host")}${req.originalUrl}`);
    if (req.body.username === undefined || req.body.password === undefined) {
      sender(res, 404, "Invalid input");
    } else {
      datalayer.getByUsername(req.body.username).then(dataUser => {
        if (dataUser.length === 0) {
          sender(res, 404, "username not found");
        } else {
          let user = dataUser[0];
          if (bcrypt.compareSync(req.body.password, user.password)) {
            const token = jwt.sign(user, "mysecretkeytoken", {
              expiresIn: "12h"
            });
            user.role_data =
              user.role_data[0] !== undefined ? user.role_data[0] : {};
            sender(res, 200, Object.assign({}, user, { token: token }));
          } else {
            sender(res, 404, `Password didn't match`);
          }
        }
      });
    }
  },
  sendEmail: (req, res) => {
    console.log(`POST: ${req.protocol}://${req.get("host")}${req.originalUrl}`);
    let verificationCode = Math.random()
      .toString(36)
      .slice(-8);
    let mailOption = {
      from: senderMail,
      to: req.body.email,
      subject: "No Reply",
      html: `<h1>Kode Verifikasi</h1><h3>Berikut adalah kode verifikasi anda: <strong>${verificationCode}</strong></h3>`
    };
    transporter.sendMail(mailOption, (error, info) => {
      if (error) {
        sender(res, 404, err);
      } else {
        sender(res, 200, {
          info,
          verificationCode: verificationCode
        });
      }
    });
  }
};
