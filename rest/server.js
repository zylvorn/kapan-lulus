/* this server is connecting to mongodb with REST API,
only use this method if Prisma can't handle the conditions you requested in frontend,
and must calculate something in backend */

import "app-module-path/register";
import "babel-polyfill";
import { json as convertToJSON, urlencoded } from "body-parser";
import routes from "./routes";
import { DatabaseConnection as DB } from "./config/db.connect";
import cors from "cors";
import express from "express";
export const serviceAPI = () => {
  DB.connect(err => {
    if (err !== null) {
      process.exit();
    } else {
      const server = express();
      server.use(cors());
      // body parser to get input in body html
      server.use(convertToJSON({ limit: "50mb" }));
      server.use(urlencoded({ extended: false, limit: "50mb" }));
      routes(server);
      // listen port
      const port = process.env.PORT || 8080;
      server.listen(port, () => console.log(`Server REST run on port ${port}`));
    }
  });
};
