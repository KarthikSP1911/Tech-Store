import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";
import path from "path";
import { fileURLToPath } from "url";
import logger from "./utils/logger.js"; // your custom morgan/chalk file
import errorLogger from "./utils/errorlogger.js";




const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.join(__dirname, "../public");




app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(helmet());
// app.use(cors({ origin: "*", credentials: true }));
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
// app.use(cors({
//   origin: process.env.FRONTEND_URL, // e.g., http://localhost:5173     for specific url
//   credentials: true,
// }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
//app.use(morgan("dev"));
app.use(logger);
app.use(compression());
app.use(express.static(publicPath));

//routes import
import ex from './routes/ex.routes.js'
import products from "./routes/products.routes.js"
import user from "./routes/user.routes.js"


// app.use((req, res, next) => {
//   res.set('Cache-Control', 'no-store'); // Prevents storing response
//   next();
// });

app.use(errorLogger);
//routes declaration
app.use("/api/v1/ex", ex);
app.use("/api/products", products);
app.use("/api/user/", user);



// Default error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});


// http://localhost:8000/api/v1/ex/register





app.get("/", (req, res) => {
    res.json({ message: "BACKEND API is running..." });
});

export default app;
