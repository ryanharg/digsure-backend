const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");
const routes = require('./routes.js');

const { errorConverter, errorHandler } = require("./middlewares/error");
const ApiError = require("./utils/ApiError");
const httpStatus = require("http-status");

const app = express();

// ✅ Enable CORS for frontend
app.use(cors({
  origin: "http://localhost:3000", // Change this if your frontend runs on a different address
  credentials: true
}));

// ✅ Security middleware
app.use(helmet());

// ✅ Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Sanitize requests
app.use(xss());
app.use(mongoSanitize());

// ✅ Gzip compression
app.use(compression());

// ✅ HTTP request logging (in dev)
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// ✅ Rate limiter (optional: uncomment if needed)
/*
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);
*/

// ✅ Routes
app.use("/api", routes);

// ✅ Handle 404s
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

// ✅ Convert errors to proper format
app.use(errorConverter);

// ✅ Handle errors
app.use(errorHandler);

module.exports = app;
