import express from "express";
import dotenv from "dotenv";
import path from "path"
dotenv.config()
import { ApiError } from "./errors/apiError";
import friendRoutes from "./routes/friendRoutesAuth";
import { Request, Response } from "express";
import cors from "cors"
//import simpleLogger from "./middelware/simpleLogger";
const app = express();
app.use(express.json());
//app.use(simpleLogger)
import logger, { stream } from "./middleware/logger";
const morganFormat = process.env.NODE_ENV == "production" ? "combines" : "dev"


app.use(require("morgan")(morganFormat, { stream }));
app.set("logger", logger);
logger.log("info", "Server started");

/* const cors = require("cors");
app.use(cors()); //Enables Cors for All CORS requests. Cors can also be enables for a single route.
 */
app.use(express.static(path.join(process.cwd(), "public")))

app.use(cors())

app.use("/api/friends", friendRoutes);

//Add auth for specific endpoint
//import authMiddleware from "./middelware/basic-auth";
//app.use("/demo", authMiddleware);



app.get("/demo", (req, res) => {
    res.send("Server is really up");
});



// Remove this if login function needs gone
import authMiddleware from "./middleware/basic-auth"
//app.use("/graphql", authMiddleware)
///////////////////////////////////////////////////////


app.use("/graphql", (req, res, next) => {
    const body = req.body;
    if (body && body.query && body.query.includes("createFriend")) {
      console.log("Create")
      return next();
    }
    if (body && body.operationName && body.query.includes("IntrospectionQuery")) {
      return next();
    }
    if (body.query && (body.mutation || body.query)) {
      return authMiddleware(req, res, next)
    }
    next()
  })
  
  import { graphqlHTTP } from 'express-graphql';
  import { schema } from './graphql/schema';



app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true,
}));


//Our own default 404-handler for api-requests
app.use("/api", (req: Request, res: Response, next) => {
    res.status(404).json({ errorCode: 404, msg: "not found" })
});


//Makes JSON error-response for ApiErrors, otherwise pass on to the default error handler
app.use((err: any, req: Request, res: Response, next: Function) => {
    if (err instanceof (ApiError)) {
        res.status(err.errorCode).json({ errorCode: err.errorCode, msg: err.message })
    } else {
        next(err)
    }
});


export default app;