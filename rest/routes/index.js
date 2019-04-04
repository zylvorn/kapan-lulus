import test from "../logic/test";
import user from "../logic/user";
import routes from "./routes";
import { checkToken } from "../authorization/auth";
export default server => {
  server.get(routes.test, test.getData);
  server.post(routes.test, test.createData);
  server.put(`${routes.test}/:id`, test.editData);

  server.get(routes.get_user, checkToken, user.getData);
  server.post(routes.create_user, checkToken, user.createData);
  server.post(routes.login_user, user.login);
};