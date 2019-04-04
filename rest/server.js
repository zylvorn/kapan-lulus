/* this server is connecting to mongodb with REST API,
only use this method if Prisma can't handle the conditions you requested in frontend,
and must calculate something in backend */

import "app-module-path/register";
import "babel-polyfill";
import { json as convertToJSON, urlencoded } from "body-parser";
import routes from "./routes";
import { DatabaseConnection as DB } from "./config/db.connect";

export const serviceAPI = () => {
  DB.connect(err => {
    if (err !== null) {
      process.exit();
    } else {
      const server = require("express")();
      // body parser to get input in body html
      server.use(convertToJSON());
      server.use(urlencoded({ extended: false }));
      routes(server);
      // listen port
      server.listen(8080, () => console.log(`Server REST run on port 8080`));
    }
  });
};
