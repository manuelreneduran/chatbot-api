import express from "express";
import cors from "cors";
import "dotenv/config";
import "./services/openAI";
import apiRoutes from "./routes/api.ts";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 8080;

app.use(apiRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
