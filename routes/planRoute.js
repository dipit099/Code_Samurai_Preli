import express from "express";
import pool from "../DB.js";

const router = express.Router();

// Helper function to calculate time difference in minutes
function getTimeDifferenceInMinutes(time1, time2) {
    const [hours1, minutes1] = time1.split(':').map(Number);
    const [hours2, minutes2] = time2.split(':').map(Number);
    return (hours2 - hours1) * 60 + (minutes2 - minutes1);
}

router.post('/', async (req, res) => {
    const { wallet_id, time_after, station_from, station_to } = req.body;

    try {
        // Query the database to find the wallet balance
        const walletQuery = await pool.query(`
            SELECT "balance" FROM "User" WHERE "wallet_id" = $1
        `, [wallet_id]);

        if (walletQuery.rows.length === 0) {
            // If wallet does not exist, return 404 status code with a message
            return res.status(404).json({ message: `Wallet with ID ${wallet_id} was not found`});
        }

        const walletBalance = walletQuery.rows[0].balance;

        // Query the database to find all stops between station_from and station_to
        const stopsQuery = await pool.query(`
            SELECT "train_id", "station_id", "arrival_time", "departure_time", "fare"
            FROM "Stops"
            WHERE "train_id" IN (
                SELECT "train_id"
                FROM "Stops"
                WHERE "station_id" = $1
                INTERSECT
                SELECT "train_id"
                FROM "Stops"
                WHERE "station_id" = $2
            )
            AND "station_id" >= $1 AND "station_id" <= $2
        `, [station_from, station_to]);

        if (stopsQuery.rows.length === 0) {
            // If no tickets available, return 403 status code with a message
            return res.status(403).json({ message: `No ticket available for station: ${station_from} to station: ${station_to}`});
        }

        // Calculate total fare for the trip
        let totalFare = 0;
        for (let i = 0; i < stopsQuery.rows.length - 1; i++) {
            totalFare += stopsQuery.rows[i].fare;
        }

        // Check if wallet has sufficient balance
        if (walletBalance < totalFare) {
            // If insufficient balance, return 402 status code with a message
            const shortageAmount = totalFare - walletBalance;
            return res.status(402).json({ message: `Recharge amount: ${shortageAmount} to purchase the ticket` });
        }

        // Deduct fare from wallet balance
        const remainingBalance = walletBalance - totalFare;

        // Calculate departure and arrival times for each station
        let currentTime = time_after;
        const stations = [];
        for (const stop of stopsQuery.rows) {
            const arrivalTime = currentTime;
            if (stop.departure_time) {
                currentTime = stop.departure_time;
            }
            const departureTime = currentTime;
            stations.push({
                station_id: stop.station_id,
                train_id: stop.train_id,
                arrival_time: stop.arrival_time ? stop.arrival_time : null,
                departure_time: stop.departure_time ? stop.departure_time : null
            });

            // Break the loop if the destination station is reached
            if (stop.station_id === station_to) {
                break;
            }
        }

        // Generate ticket ID (can be a random number for simplicity)
        const ticketId = Math.floor(Math.random() * 10000) + 1;

        // Respond with 201 status code and ticket information
        return res.status(201).json({
            ticket_id: ticketId,
            balance: remainingBalance,
            wallet_id: wallet_id,
            stations: stations
        });

    } catch (err) {
        console.error("Error purchasing ticket:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
