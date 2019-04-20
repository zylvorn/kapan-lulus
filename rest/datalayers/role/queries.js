export const findCollection = (db, pattern, field) => {
  return new Promise((resolve, reject) => {
    db.collection("master-role")
      .aggregate([{ $match: { [field]: pattern } }])
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
