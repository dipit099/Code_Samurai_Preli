// routes/userRoute.js
import express from "express";
import pool from "../DB.js";

const router = express.Router();

// Route to create a new user
router.post('/', async (req, res) => {
    try {
        const { user_id, user_name, balance } = req.body;

        // Insert the user into the database with wallet_id same as user_id
        const insertedUser = await pool.query(
            'INSERT INTO "User" ("user_id", "user_name", "balance", "wallet_id") VALUES ($1, $2, $3, $1) RETURNING *',
            [user_id, user_name, balance]
        );

        // Extracting the required properties from insertedUser.rows[0]
        const responseData = {
            user_id: insertedUser.rows[0].user_id,
            user_name: insertedUser.rows[0].user_name,
            balance: insertedUser.rows[0].balance
        };

        // Sending the response with status 201 and the new object
        res.status(201).send(responseData);

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

export default router;
