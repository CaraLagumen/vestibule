const app = require("./server/app");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });
const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log(`DB connection successful!`);
  });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on("uncaughtException", err => {
  console.log("Uncaught excepction. Shutting down...");
  console.log(err.name, err.message);
  process.exit(1); //1 STANDS FOR UNCALLED EXCEPTION, 0 FOR SUCCESS
});

//LISTEN TO EVENT (EX. DB PW WRONG IN CONFIG.ENV)
process.on("unhandledRejection", err => {
  console.log("Unhandled rejection. Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1); //1 STANDS FOR UNCALLED EXCEPTION, 0 FOR SUCCESS
  });
});

//SIGTERM IS SIGNAL FROM HEROKU SENT TO THE APP TO SHUTDOWN DAILY
process.on("SIGTERM", () => {
  console.log("SIGTERM RECEIVED. Shutting down gracefully.");
  server.close(() => {
    console.log(`Process terminated.`);
  });
});
