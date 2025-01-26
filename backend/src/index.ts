import dotenv from "dotenv";
dotenv.config();

import express, { Express, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import multer from "multer";
import { submitController } from "./controller/submit-controller";
import bodyParser from "body-parser";

const app: Express = express();

app.use(express.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
app.use(morgan("combined"));
app.use((req, res, next) => {
  res.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  next();
});

const storage = multer.memoryStorage(); // Storing file in memory as a buffer
const upload = multer({ storage });

// Health check route
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "hello world" });
});

app.post("/submit", upload.single("files"), submitController);

const PORT = process.env.PORT || 3001;

(async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Application startup failed:", error);
    process.exit(1);
  }
})();
