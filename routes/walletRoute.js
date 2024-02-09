import express from "express";
import pool from "../DB.js";

const router = express.Router();

router.get('/:wallet_id', async (req, res) => {
    const walletId = parseInt(req.params.wallet_id);

    try {
        // Query the database to find the wallet information
        const queryResult = await pool.query(`
            SELECT "user_id", "user_name", "balance"
            FROM "User"
            WHERE "wallet_id" = $1
        `, [walletId]);

        // Check if the user with the wallet exists
        if (queryResult.rows.length === 0) {
            // If user does not exist with the provided wallet ID, return 404 status code with a message
            return res.status(404).json({ message: `wallet with id: ${walletId} was not found` });
        }

        // If user exists, return 200 status code with user's wallet information
        const userInfo = queryResult.rows[0];
        return res.status(200).json({
            wallet_id: walletId,
            balance: userInfo.balance,
            wallet_user: {
                user_id: userInfo.user_id,
                user_name: userInfo.user_name
            }
        });
    } catch (err) {
        console.error("Error retrieving wallet balance:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.put('/:wallet_id', async (req, res) => {
    const walletId = parseInt(req.params.wallet_id);
    const rechargeAmount = req.body.recharge;

    try {
        // Check if the wallet exists
        const walletCheckQuery = await pool.query(`
            SELECT * FROM "User" WHERE "wallet_id" = $1
        `, [walletId]);

        if (walletCheckQuery.rows.length === 0) {
            // If wallet does not exist, return 404 status code with a message
            return res.status(404).json({ message: `Wallet with ID ${walletId} was not found` });
        }

        // Check if recharge amount is within the range of 100 to 10000 Taka
        if (rechargeAmount < 100 || rechargeAmount > 10000) {
            // If recharge amount is out of range, return 400 status code with a message
            return res.status(400).json({ message: `Invalid amount: ${rechargeAmount}` });
        }

        // Update wallet balance
        const updateBalanceQuery = await pool.query(`
            UPDATE "User"
            SET "balance" = "balance" + $1
            WHERE "wallet_id" = $2
            RETURNING "balance"
        `, [rechargeAmount, walletId]);

        // Respond with updated wallet information
        return res.status(200).json({
            wallet_id: walletId,
            balance: updateBalanceQuery.rows[0].balance,
            wallet_user: {
                user_id: walletCheckQuery.rows[0].user_id,
                user_name: walletCheckQuery.rows[0].user_name
            }
        });
    } catch (err) {
        console.error("Error adding funds to wallet:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});


export default router;
