import express from "express";
import cors from "cors";
import apiRoutes from "./routes/api.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 3000;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

app.use(apiRoutes);
