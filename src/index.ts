import express from "express";
import cors from "cors";
import "dotenv/config";
import "./services/openAIClient.js";
import apiRoutes from "./routes/api.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 8080;

app.use(apiRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
