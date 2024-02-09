import express from "express";
import pool from "../DB.js";

const router = express.Router();

router.post('/', async (req, res) => {
    const { train_id, train_name, capacity, stops } = req.body;
    try {
        if (train_id && train_name && capacity && stops && Array.isArray(stops) && stops.length > 0) {
            let service_start = null;
            let service_ends = null;
            let num_stations = stops.length;

            // Find service_start and service_ends based on stops
            stops.forEach(stop => {
                if (stop.departure_time && (!service_start || stop.departure_time < service_start)) {
                    service_start = stop.departure_time;
                }
                if (stop.arrival_time && (!service_ends || stop.arrival_time > service_ends)) {
                    service_ends = stop.arrival_time;
                }
            });

            // Start a transaction
            const client = await pool.connect();
            await client.query('BEGIN');

            try {
                // Insert train data into Train table
                await client.query(`
                    INSERT INTO "Train" ("train_id", "train_name", "capacity", "service_start", "service_ends", "num_stations")
                    VALUES ($1, $2, $3, $4, $5, $6)
                `, [train_id, train_name, capacity, service_start, service_ends, num_stations]);

                // Insert stops data into Stops table
                for (const stop of stops) {
                    await client.query(`
                        INSERT INTO "Stops" ("train_id", "station_id", "arrival_time", "departure_time", "fare")
                        VALUES ($1, $2, $3, $4, $5)
                    `, [train_id, stop.station_id, stop.arrival_time, stop.departure_time, stop.fare]);
                }

                // Commit the transaction
                await client.query('COMMIT');

                // Respond with the inserted train data
                res.status(201).json({
                    "train_id": train_id,
                    "train_name": train_name,
                    "capacity": capacity,
                    "service_start": service_start,
                    "service_ends": service_ends,
                    "num_stations": num_stations
                });
            } catch (err) {
                // Rollback the transaction in case of an error
                await client.query('ROLLBACK');
                throw err;
            } finally {
                // Release the client back to the pool
                client.release();
            }
        } else {
            res.status(400).json({ message: "Invalid request body" });
        }
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

export default router;
