import express from "express";
import pool from "../DB.js";

const router = express.Router();

router.post('/', async (req, res) => {
    const { station_id, station_name, longitude, latitude } = req.body;
    try {
        if (station_id && station_name && longitude && latitude) { // Check if all required fields are provided
            await pool.query('INSERT INTO "Station" ("station_id", "station_name", "longitude", "latitude") VALUES ($1, $2, $3, $4)', [station_id, station_name, longitude, latitude]);
            console.log("Successfully added station");
            res.status(201).json({ // Respond with status code 201 and JSON data
                "station_id": station_id,
                "station_name": station_name,
                "longitude": longitude,
                "latitude": latitude
            });
        } else {
            res.status(400).json({ message: "All fields are required" }); // Respond with status code 400 and error message
        }
    } catch (err) {
        console.log(err);
        res.sendStatus(500); // Respond with status code 500 for server error
    }
});

export default router;
