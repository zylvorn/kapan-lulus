import sender from './response-sender'
import datalayer from '../datalayers/test/test'
export default {
  getData: (req, res) => {
    console.log(`GET: ${req.protocol}://${req.get('host')}${req.originalUrl}`)
    datalayer.getData()
      .then(data => {
        sender(res, 200, data)
      })
      .catch(err => sender(res, 404, err))
  },
  createData: (req, res) => {
    console.log(`POST: ${req.protocol}://${req.get('host')}${req.originalUrl}`)
    datalayer.createData(req.body)
      .then(data => {
        sender(res, 200, data)
      })
      .catch(err => sender(res, 404, err))
  },
  editData: (req, res) => {
    console.log(`PUT: ${req.protocol}://${req.get('host')}${req.originalUrl}`)
    datalayer.updateData(req.params.id, req.body)
      .then(data => {
        sender(res, 200, data)
      })
      .catch(err => sender(res, 404, err))
  }
}
