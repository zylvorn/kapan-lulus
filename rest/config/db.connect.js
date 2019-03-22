import { MongoClient } from 'mongodb'
import dbConfig from './db.config.json'

export const DatabaseConnection = {
  connect: callback => {
    let url = `${dbConfig.hostOne.url}`
    MongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
      if (!err) {
        callback(null, db.db(dbConfig.hostOne.name))
      } else {
        callback(err)
      }
    }
    )
  }
}
