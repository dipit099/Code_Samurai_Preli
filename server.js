// app.js
import express from "express";
import insertDataRoute from "./routes/insertDataRoute.js";
import getAllDataRoute from "./routes/getAllDataRoute.js";
import pool from "./DB.js";

const port = 8000;
const app = express();

app.use(express.json());

// Routes
app.use("/", insertDataRoute);
app.use("/", getAllDataRoute);




app.listen(port, () => {
    console.log(`Server at http://localhost:${port}`);
});

export default app;
