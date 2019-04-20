import { ObjectID } from "mongodb";
export const readData = db => {
  return new Promise((resolve, reject) => {
    db.collection("master-user")
      .find({})
      .toArray((isErr, data) => {
        if (isErr) {
          const err = {
            message: "error while execute query",
            err: isErr
          };
          reject(err);
        } else resolve(data);
      });
  });
};

export const findCollection = (db, pattern, field, isLogin) => {
  return new Promise((resolve, reject) => {
    if (isLogin) {
      db.collection("master-user")
        .aggregate([
          {
            $lookup: {
              from: "master-role",
              localField: "id_role",
              foreignField: "_id",
              as: "role_data"
            }
          },
          {
            $lookup: {
              from: "user-file",
              localField: "id_card_photo",
              foreignField: "_id",
              as: "card_file"
            }
          },
          {
            $lookup: {
              from: "user-file",
              localField: "id_profile_photo",
              foreignField: "_id",
              as: "profile_file"
            }
          },
          field === "username" || field === "email"
            ? { $match: { [field]: pattern } }
            : { $match: { [field]: { $regex: new RegExp(pattern, "i") } } }
        ])
        .toArray((isErr, data) => {
          if (isErr) {
            const err = {
              message: "error while execute query",
              err: isErr
            };
            reject(err);
          } else resolve(data);
        });
    } else {
      db.collection("master-user")
        .aggregate([
          {
            $lookup: {
              from: "master-role",
              localField: "id_role",
              foreignField: "_id",
              as: "role_data"
            }
          },
          field === "username" || field === "email"
            ? { $match: { [field]: pattern } }
            : { $match: { [field]: { $regex: new RegExp(pattern, "i") } } }
        ])
        .toArray((isErr, data) => {
          if (isErr) {
            const err = {
              message: "error while execute query",
              err: isErr
            };
            reject(err);
          } else resolve(data);
        });
    }
  });
};

export const createData = (db, dataInput) => {
  return new Promise((resolve, reject) => {
    db.collection("master-user").insertOne(dataInput, (isErr, dataOutput) => {
      if (!isErr) resolve(dataOutput);
      else {
        let err = {
          message: "error while execute query to create data on database",
          err: isErr
        };
        reject(err);
      }
    });
  });
};

export const updateData = (db, id, dataInput) => {
  return new Promise((resolve, reject) => {
    db.collection("master-user").updateOne(
      { _id: new ObjectID(id) },
      {
        $set: dataInput
      },
      (isErr, dataOutput) => {
        if (!isErr) resolve(dataOutput);
        else {
          let err = {
            message: "error while execute query to edit data on database",
            err: isErr
          };
          reject(err);
        }
      }
    );
  });
};

export const uploadData = (db, dataInput) => {
  return new Promise((resolve, reject) => {
    db.collection("user-file").insertOne(dataInput, (isErr, dataOutput) => {
      if (!isErr) resolve(dataOutput);
      else {
        let err = {
          message: "error while execute query to create data on database",
          err: isErr
        };
        reject(err);
      }
    });
  });
};

export const uploadManyData = (db, dataInput) => {
  return new Promise((resolve, reject) => {
    db.collection("user-file").inserMany(dataInput, (isErr, dataOutput) => {
      console.log(err);
      console.log(dataOutput);
      if (!isErr) resolve(dataOutput);
      else {
        let err = {
          message: "error while execute query to create data on database",
          err: isErr
        };
        reject(err);
      }
    });
  });
};
