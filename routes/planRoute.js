import express from "express";
import pool from "../DB.js";

const router = express.Router();

// Helper function to calculate time difference in minutes
const getTimeDifferenceInMinutes = (time1, time2) => {
    const [hours1, minutes1] = time1.split(':').map(Number);
    const [hours2, minutes2] = time2.split(':').map(Number);
    return (hours2 - hours1) * 60 + (minutes2 - minutes1);
};

router.get('/', async (req, res) => {
    const { station_from, station_to, optimize } = req.query;

    try {
        // Execute the recursive SQL query to find optimal routes
        const routesQuery = await pool.query(`
            WITH RECURSIVE Route AS (
                SELECT 
                    s1."train_id", 
                    s1."station_id" AS "current_station_id", 
                    s1."arrival_time" AS "current_arrival_time", 
                    s1."departure_time" AS "current_departure_time", 
                    s1."fare" AS "current_fare", 
                    s2."station_id" AS "next_station_id",
                    s2."arrival_time" AS "next_arrival_time",
                    s2."departure_time" AS "next_departure_time",
                    s2."fare" AS "next_fare",
                    s2."departure_time" AS "start_time"
                FROM 
                    "Stops" s1
                JOIN 
                    "Stops" s2 ON s1."train_id" = s2."train_id" AND s1."station_id" < s2."station_id"
                WHERE 
                    s1."station_id" = $1 -- Initial station
              UNION ALL
                SELECT 
                    r."train_id", 
                    r."next_station_id" AS "current_station_id", 
                    r."next_arrival_time" AS "current_arrival_time", 
                    r."next_departure_time" AS "current_departure_time", 
                    r."next_fare" AS "current_fare", 
                    s."station_id" AS "next_station_id",
                    s."arrival_time" AS "next_arrival_time",
                    s."departure_time" AS "next_departure_time",
                    s."fare" AS "next_fare",
                    CASE 
                        WHEN r."current_station_id" = $1 THEN s."departure_time" 
                        ELSE r."start_time" 
                    END AS "start_time"
                FROM 
                    Route r
                JOIN 
                    "Stops" s ON r."train_id" = s."train_id" AND r."next_station_id" = s."station_id"
            )
            SELECT 
                "train_id", 
                "current_station_id", 
                "current_arrival_time", 
                "current_departure_time", 
                "current_fare", 
                "next_station_id",
                "next_arrival_time",
                "next_departure_time",
                "next_fare",
                SUM("current_fare") OVER(ORDER BY "train_id", "next_station_id" ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS "total_cost",
                SUM(getTimeDifferenceInMinutes("start_time", "next_arrival_time")) OVER(ORDER BY "train_id", "next_station_id" ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS "total_time"
            FROM 
                Route
            WHERE 
                "next_station_id" = $2 -- Destination station
            ORDER BY 
                "${optimize}" ASC
        `, [station_from, station_to]);

        // Check if any routes were found
        if (routesQuery.rows.length === 0) {
            return res.status(403).json({ message: `No routes available from station: ${station_from} to station: ${station_to}` });
        }

        // Extract relevant route information
        const optimalRoute = {
            total_cost: routesQuery.rows[0].total_cost,
            total_time: routesQuery.rows[0].total_time,
            stations: routesQuery.rows.map(row => ({
                station_id: row.current_station_id,
                train_id: row.train_id,
                arrival_time: row.current_arrival_time,
                departure_time: row.current_departure_time
            }))
        };

        // Respond with the optimal route
        return res.status(200).json(optimalRoute);

    } catch (err) {
        console.error("Error planning route:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
