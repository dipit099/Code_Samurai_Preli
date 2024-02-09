// routes/stationRoute.js
import express from "express";
import pool from "../DB.js";

const router = express.Router();

// Route to get all schools
router.get('/', async (req, res) => {
    try {
        const data = await pool.query('SELECT * FROM "Station"');
        const stations = data.rows; // Populate the stations list with the data
        res.status(200).send({ stations }); // Send the stations list as a response
        console.log(stations);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

router.post('/', async (req, res) => {
    try {
<<<<<<< HEAD
        const {station_id, station_name, longitude, latitude} = req.body;
        console.log(req.body);

        const insertedStation = await pool.query(
            'INSERT INTO "Station" ("station_id", "station_name", "longitude", "latitude") VALUES ($1, $2, $3, $4) RETURNING *',
            [station_id, station_name, longitude, latitude]
        );

        res.status(201).send(insertedStation.rows[0]);

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

=======
        const { station_id, station_name, longitude, latitude } = req.body;
        console.log(req.body);
>>>>>>> 8e69b7a32902bde263ab09d602e3dd6676166709

        const insertedStation = await pool.query(
            'INSERT INTO "Station" ("station_id", "station_name", "longitude", "latitude") VALUES ($1, $2, $3, $4) RETURNING *',
            [station_id, station_name, longitude, latitude]
        );

        res.status(201).send(insertedStation.rows[0]);

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

router.get('/:id/trains', async (req, res) => {
    const { id } = req.params;
    try {
        const data = await pool.query(
            'SELECT train_id, to_char(arrival_time, \'HH:MI\') as arrival_time, to_char(departure_time, \'HH:MI\') as departure_time FROM "Stops" WHERE "station_id" = $1 ORDER BY departure_time ASC NULLS FIRST, arrival_time ASC NULLS FIRST, train_id ASC',
            [id]
        );
        const trains = data.rows;
        res.status(200).send({ station_id: id, trains });
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

// Route to get a specific school by ID
// router.get('/:id', async (req, res) => {
//     const { id } = req.params;
//     try {
//         const data = await pool.query('SELECT * FROM schools WHERE id = $1', [id]);
//         if (data.rows.length === 0) {
//             res.status(404).send({ message: "School not found" });
//         } else {
//             res.status(200).send(data.rows[0]);
//         }
//     } catch (err) {
//         console.log(err);
//         res.sendStatus(500);
//     }
// });

export default router;