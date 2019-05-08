const express = require("express");
const nunjucks = require("nunjucks");
const session = require("express-session");
const LokiStore = require("connect-loki")(session);
const path = require("path");
const flash = require("connect-flash");
const dateFilter = require("nunjucks-date-filter");

class App {
  constructor() {
    this.express = express();
    this.isDev = process.env.NODE_ENV !== "production";

    this.middlewares();
    this.views();
    this.routes();
  }
  middlewares() {
    this.express.use(express.urlencoded({ extended: false }));
    this.express.use(flash());
    this.express.use(
      session({
        store: new LokiStore({
          path: path.resolve(__dirname, "..", "tmp", "session.db")
        }),
        name: "root",
        secret: "MyAppSecret",
        resave: true,
        saveUninitialized: true
      })
    );
  }

  views() {
    const env = nunjucks.configure(path.resolve(__dirname, "app", "views"), {
      watch: this.isDev,
      express: this.express,
      autoescape: true
    });

    env.addFilter("date", dateFilter);

    //tornando visível ao express a pasta "public"
    this.express.use(express.static(path.resolve(__dirname, "public")));

    this.express.set("view engine", "njk");
  }

  routes() {
    this.express.use(require("./routes"));
  }
}

//exportando uma instancia da classe App
module.exports = new App().express;
