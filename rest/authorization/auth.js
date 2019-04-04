import jwt from "jsonwebtoken";
const auth = { secretKey: "mysecretkeytoken" };
import sender from "../logic/response-sender";

export const checkToken = (req, res, next) => {
  if (!req.headers.authorization) {
    sender(res, 401, "You Are Not Authorized!");
  } else {
    let token = req.headers.authorization;
    jwt.verify(token, auth.secretKey, (_, decoded) => {
      if (decoded === undefined) {
        sender(res, 401, "You Are Not Authorized!");
      } else {
        req.userdata = decoded;
        next();
      }
    });
  }
};
