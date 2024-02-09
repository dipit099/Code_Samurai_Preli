import express from "express";
import pool from "../DB.js";

const router = express.Router();

// POST method to create tickets
router.post('/', async (req, res) => {
    const { wallet_id, time_after, station_from, station_to } = req.body;

    try {
        // Check if the requested time is in a valid format (e.g., "HH:mm")
        const timePattern = /^\d{2}:\d{2}$/;
        if (!timePattern.test(time_after)) {
            return res.status(400).json({ message: "Invalid time format. Please provide time in 'HH:mm' format." });
        }

        // Find all possible routes between station_from and station_to
        const routesQuery = `
            WITH RECURSIVE "Route" AS (
                SELECT
                    1 AS step,
                    s."station_id" AS current_station,
                    NULL::INTEGER AS prev_station,
                    NULL::INTEGER AS train_id,
                    s."station_id" AS dest_station,
                    0 AS total_fare,
                    NULL::TIME AS arrival_time,
                    NULL::TIME AS departure_time
                FROM
                    "Station" s
                WHERE
                    s."station_id" = $1

                UNION ALL

                SELECT
                    r.step + 1,
                    st."station_id" AS current_station,
                    r.dest_station AS prev_station,
                    st."train_id",
                    r.dest_station AS dest_station,
                    r.total_fare + COALESCE(st."fare", 0) AS total_fare,
                    st."arrival_time",
                    st."departure_time"
                FROM
                    "Route" r
                JOIN
                    "Stops" st ON r.dest_station = st."station_id" AND r.train_id = st."train_id"
                WHERE
                    st."station_id" <> r.prev_station
                    AND st."departure_time" > COALESCE(r.arrival_time, '00:00:00')
                    AND st."arrival_time" > $3  -- Check if arrival time is after the specified time_after
                    AND r.step < 10
            )
            SELECT
                *
            FROM
                "Route"
            WHERE
                dest_station = $2
            ORDER BY
                total_fare, step;
        `;
        
        const { rows } = await pool.query(routesQuery, [station_from, station_to, time_after]);

        if (rows.length === 0) {
            return res.status(403).json({ message: `No ticket available for station ${station_from} to station ${station_to}` });
        }

        const selectedRoute = rows[0];

        // Calculate the remaining balance
        const walletQuery = 'SELECT "balance" FROM "User" WHERE "wallet_id" = $1';
        const walletResult = await pool.query(walletQuery, [wallet_id]);
        const currentBalance = walletResult.rows[0].balance;
        const remainingBalance = currentBalance - selectedRoute.total_fare;

        // Check if the user has enough balance
        if (remainingBalance < 0) {
            return res.status(402).json({ message: `Recharge amount: ${Math.abs(remainingBalance)} to purchase the ticket` });
        }

        // Insert ticket information into the Ticket table
        const insertTicketQuery = `
            INSERT INTO "Ticket" ("ticket_id", "wallet_id", "balance")
            VALUES ((SELECT COALESCE(MAX("ticket_id"), 0) FROM "Ticket") + 1, $1, $2)
            RETURNING "ticket_id";
        `;
        const ticketResult = await pool.query(insertTicketQuery, [wallet_id, remainingBalance]);
        const ticketId = ticketResult.rows[0].ticket_id;

        // Return the ticket information
        return res.status(201).json({
            ticket_id: ticketId,
            balance: remainingBalance,
            stations: rows.map(route => ({
                station_id: route.dest_station,
                train_id: route.train_id,
                arrival_time: route.arrival_time,
                departure_time: route.departure_time
            }))
        });
    } catch (error) {
        console.error("Error creating ticket:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
