import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createTransport } from "nodemailer";

import sender from "./response-sender";
import datalayer from "../datalayers/user/user";
import roleDataLayer from "../datalayers/role/role";
import moment from "moment";
import { ObjectID } from "mongodb";

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
    roleDataLayer.findCollection(req.body.role.name, "name").then(role => {
      const id_role = role[0]._id;
      const id_card_photo = new ObjectID();
      const id_profile_photo = new ObjectID();
      const id_user = new ObjectID();
      bcrypt.genSalt(10, (_, salt) => {
        bcrypt.hash(req.body.password, salt, (_, hash) => {
          const userdata = {
            _id: id_user,
            username: req.body.name,
            email: req.body.email,
            id_role: id_role,
            password: hash,
            university: req.body.university,
            year_of_entry: req.body.yearOfEntry,
            department: req.body.department,
            student_id: req.body.studentID,
            id_card_photo: id_card_photo,
            id_profile_photo: id_profile_photo,
            topic: req.body.topic,
            est_graduate_date: req.body.estGraduationDate,
            is_active: true,
            is_first_register: true,
            created_by: new ObjectID("5ca5c6597fe7a56f1128641a"),
            created_date: moment().format(),
            modified_by: new ObjectID("5ca5c6597fe7a56f1128641a"),
            modified_date: moment().format()
          };
          const dataSendToUserFile = [
            {
              _id: id_card_photo,
              file: req.body.cardPhoto,
              file_size: req.body.propertyCardPhoto.file_size,
              file_type: req.body.propertyCardPhoto.file_type,
              id_role: id_role,
              id_user: id_user,
              is_active: true,
              created_by: new ObjectID("5ca5c6597fe7a56f1128641a"),
              created_date: moment().format()
            },
            {
              _id: id_profile_photo,
              file: req.body.profilePhoto,
              file_size: req.body.propertyProfilePhoto.file_size,
              file_type: req.body.propertyProfilePhoto.file_type,
              id_role: id_role,
              id_user: id_user,
              is_active: true,
              created_by: new ObjectID("5ca5c6597fe7a56f1128641a"),
              created_date: moment().format()
            }
          ];
          const dataToClient = Object.assign({}, userdata, {
            card_file: dataSendToUserFile[0],
            profile_file: dataSendToUserFile[1],
            role_data: role[0]
          });
          const token = jwt.sign(dataToClient, "mysecretkeytoken", {
            expiresIn: "12h"
          });
          datalayer.createData(userdata).then(() => {
            dataSendToUserFile.forEach((item, i) => {
              datalayer
                .uploadFile(item)
                .then(() => {
                  if (i === 1) {
                    sender(
                      res,
                      200,
                      Object.assign({}, dataToClient, { token: token })
                    );
                  }
                })
                .catch(err => sender(res, 400, err));
            });
          });
        });
      });
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
      datalayer
        .findCollection(req.body.username, "username", true)
        .then(dataUser => {
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
              user.profile_file =
                user.profile_file[0] !== undefined ? user.profile_file[0] : {};
              user.card_file =
                user.card_file[0] !== undefined ? user.card_file[0] : {};
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
    //find username and email
    datalayer.findCollection(req.body.name, "username").then(one => {
      if (one.length === 0) {
        datalayer.findCollection(req.body.email, "email").then(two => {
          if (two.length === 0) {
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
          } else {
            sender(res, 404, "Email sudah digunakan");
          }
        });
      } else {
        sender(res, 404, "Username sudah digunakan");
      }
    });
  }
};
