// routes/userRoute.js
import express from "express";
import pool from "../DB.js";

const router = express.Router();

// Route to get all schools
router.post('/', async (req, res) => {
    try {
        const {user_id, user_name, balance} = req.body;
        console.log(req.body);

        const insertedUser = await pool.query(
            'INSERT INTO "User" ("user_id", "user_name", "balance") VALUES ($1, $2, $3) RETURNING *',
            [user_id, user_name, balance]
        );

        res.status(201).send(insertedUser.rows[0]);

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
