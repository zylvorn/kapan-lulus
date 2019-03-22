import test from '../logic/test'
import routes from './routes'
export default (server) => {
  server.get(routes.test, test.getData)
  server.post(routes.test, test.createData)
  server.put(`${routes.test}/:id`, test.editData)
}
