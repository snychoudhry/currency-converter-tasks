import express from "express";
import * as dotenv from "dotenv";
import bodyParser from "body-parser";
import { ApiRoutes } from "./routes/api"
import { Cors } from "./middlewares/cors";
import errorMiddleware from './middlewares/error.middleware';

class App {

    public app: express.Application;
    public apiRoutes: ApiRoutes = new ApiRoutes();
    public cors: Cors = new Cors();

    constructor() {
        this.app = express();
        this.config();
        this.apiRoutes.routes(this.app);
        this.initializeErrorHandling();
    }

    private initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }

    private config(): void {
        dotenv.config();
        this.app.use(this.cors.corsHeaders);
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }
}

export default new App().app;