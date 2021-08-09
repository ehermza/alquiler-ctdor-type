import express from "express";
import morgan from "morgan";
import routes from "./routes/index";
import productsRoutes from "./routes/containerRoute";
import mongoose from "mongoose";
// import cors from "cors";

class Server {
  public app: express.Application;
  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  config() {
    //connection mongodb atlas
    mongoose.connect('mongodb://localhost/alq-container', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
      .then(db => console.log('Db is connected.'))
      .catch(err => console.log(err));

     //Settings
    this.app.set("port", process.env.PORT || 5300);
    //Middlewares
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(morgan("dev"));
    // this.app.use(cors());
  }

  routes() {
    this.app.use(routes);
    this.app.use("/api/products", productsRoutes);
  }

  start() {
    this.app.listen(this.app.get("port"), () => {
      console.log("Server on port:", this.app.get("port"));
    });
  }
}

const server = new Server();
server.start();
