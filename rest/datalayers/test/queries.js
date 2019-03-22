import { ObjectID } from 'mongodb'
export const readData = (db) => {
  return new Promise((resolve, reject) => {
    db.collection('test')
      .find({})
      .toArray((isErr, data) => {
        if (isErr) {
          const err = {
            message: 'error while execute query',
            err: isErr
          }
          reject(err)
        } else resolve(data)
      })
  })
}
export const createData = (db, dataInput) => {
  return new Promise((resolve, reject) => {
    db.collection('test').insertMany(dataInput, (isErr, dataOutput) => {
      if (!isErr) resolve(dataOutput)
      else {
        let err = {
          message: 'error while execute query to create data on database',
          err: isErr
        }
        reject(err)
      }
    })
  })
}
export const updateData = (db, id, dataInput) => {
  return new Promise((resolve, reject) => {
    db.collection('test').updateOne({ _id: new ObjectID(id) }, {
      $set: dataInput
    }, (isErr, dataOutput) => {
      if (!isErr) resolve(dataOutput)
      else {
        let err = {
          message: 'error while execute query to edit data on database',
          err: isErr
        }
        reject(err)
      }
    })
  })
}
