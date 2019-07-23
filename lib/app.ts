import * as express from 'express';
import * as bodyParser from 'body-parser';
import { Routes } from './routers/index';
import * as mongoose from 'mongoose';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as Promise from "bluebird";
import * as mongo from 'connect-mongo';
import * as passport from "passport";
import { Swagger } from './swagger'

const MongoStore = mongo(session);

class App {

  public app: express.Application;
  public routePrv: Routes = new Routes();
  public swagger: Swagger = new Swagger()
  public mongoUrl: string = 'mongodb://localhost/apollo';
  constructor() {
    this.app = express();
    this.config();
    this.routePrv.routes(this.app);
    this.swagger.createSwagger(this.app);
    this.mongoSetup();
  }

  private config(): void {
    // support application/json type post data
    this.app.use(bodyParser.json());
    //support application/x-www-form-urlencoded post data
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(session({
      secret: 'apollo',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 3,
      },
      store: new MongoStore({
        url: this.mongoUrl,
        autoReconnect: true
      })
    })
    );
    this.app.use(passport.initialize());
    this.app.use(passport.session());
  }

  private mongoSetup(): void {
    (<any>mongoose).Promise = Promise;
    mongoose.connect(this.mongoUrl, { useNewUrlParser: true, useCreateIndex: true });
  }


}

export default new App().app;