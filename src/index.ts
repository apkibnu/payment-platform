import express, { Request, Response, NextFunction } from "express";
import http from "http";
import { APP_PORT, APP_URL_PREFIX } from "./libs/utils";
import * as bodyParser from "body-parser";
import { client } from "./infrastructure/database";
import { container } from "./container";
import { createHttpTerminator } from "http-terminator";
import { AppError } from "./libs/exception/app-error";
import { errorHandler } from "./libs/exception/error-handler";
import { Routes } from "./presentation/routes/routes";
import swaggerUi from "swagger-ui-express";
import swagger from "./swagger.json";
import path from "path";

const app = express();
export const server = http.createServer(app);
export const httpTerminator = createHttpTerminator({ server });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../public")));
client.connect(async (err) => {
  if (err) throw err;
  console.log("db connected");
});

const errorResponder = (
  error: AppError,
  _: Request,
  response: Response,
  _1: NextFunction
) => {
  errorHandler.handleError(error, response);
};

const invalidPathHandler = (_: Request, response: Response) => {
  response.status(400);
  response.json({
    message: "invalid path",
  });
};

const requestLogger = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  response.removeHeader("x-powered-by");
  response.header("Access-Control-Allow-Origin", "*");
  response.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  response.header(
    "Access-Control-Allow-Headers",
    "content-type, Authorization"
  );
  console.log(`${request.method} url:: ${request.url}`);
  next();
};

app.use(requestLogger);
const router = express.Router();
app.use(APP_URL_PREFIX, router);
router.get("/health-check", (_, res) => {
  res.json({
    message: "server is up boys",
  });
});
const appRoutes = container.get(Routes);
appRoutes.setRoutes(router);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swagger));
app.use(errorResponder);
app.use(invalidPathHandler);

server.listen(APP_PORT, () => {
  console.log(`Listening at http://localhost:${APP_PORT}`);
});
