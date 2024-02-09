// app.js
import express from "express";
import insertDataRoute from "./routes/insertDataRoute.js";
import getAllDataRoute from "./routes/getAllDataRoute.js";
import stationRoute from "./routes/stationRoute.js"
import trainRoute from "./routes/trainRoute.js"
import walletRoute from "./routes/walletRoute.js"
import ticketRoute from "./routes/ticketRoute.js"

import userRoute from "./routes/userRoute.js";
import stationRoute from "./routes/stationRoute.js";
import planRoute from "./routes/planRoute.js";


import pool from "./DB.js";

const port = 8000;
const app = express();

app.use(express.json());
app.use("/api/stations", stationRoute);
app.use("/api/trains", trainRoute);
app.use("/api/wallets", walletRoute);
app.use("/api/tickets", ticketRoute);
app.use("/api/users", userRoute);
app.use("/api/routes", planRoute);




app.listen(port, () => {
    console.log(`Server at http://localhost:${port}`);
});

export default app;
