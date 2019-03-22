import { DatabaseConnection } from '../../config/db.connect'
import {
  readData,
  createData,
  updateData
} from './queries'
export default {
  getData: () => {
    return new Promise((resolve, reject) => {
      DatabaseConnection.connect((isErr, db) => {
        if (!isErr) {
          readData(db).then(data => {
            resolve(data)
          }).catch(err => reject(err))
        } else {
          let err = {
            message: `error, can't connect to database`,
            err: isErr
          }
          reject(err)
        }
      })
    })
  },
  createData: (dataInput) => {
    return new Promise((resolve, reject) => {
      DatabaseConnection.connect((isErr, db) => {
        if (!isErr) {
          createData(db, dataInput).then(data => {
            resolve(data)
          }).catch(err => reject(err))
        } else {
          let err = {
            message: `error, can't connect to database`,
            err: isErr
          }
          reject(err)
        }
      })
    })
  },
  updateData: (id, dataInput) => {
    return new Promise((resolve, reject) => {
      DatabaseConnection.connect((isErr, db) => {
        if (!isErr) {
          updateData(db, id, dataInput).then(data => {
            resolve(data)
          }).catch(err => reject(err))
        } else {
          let err = {
            message: `error, can't connect to database`,
            err: isErr
          }
          reject(err)
        }
      })
    })
  }
}
