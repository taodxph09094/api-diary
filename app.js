const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const errorMiddleware = require("./middleware/error");
// Config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "config/config.env" });
}

const corsOptions = {
  origin: [process.env.FRONTEND_URL_RELEASE, "*"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  allowedMethods: ["GET", "POST", "PUT", "DELETE"],
  optionSuccessStatus: 200,
};

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cors(corsOptions));

const user = require("./routes/userRoute");
const post = require("./routes/postRoute");
app.use("/api/user", user);
app.use("/api/post", post);
app.use(errorMiddleware);
module.exports = app;
