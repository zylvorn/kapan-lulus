import { DatabaseConnection } from "../../config/db.connect";
import { findCollection } from "./queries";

export default {
  findCollection: (pattern, field) => {
    return new Promise((resolve, reject) => {
      DatabaseConnection.connect((isErr, db) => {
        if (!isErr) {
          findCollection(db, pattern, field)
            .then(data => {
              resolve(data);
            })
            .catch(err => reject(err));
        } else {
          let err = {
            message: `error, can't connect to database`,
            err: isErr
          };
          reject(err);
        }
      });
    });
  }
};
