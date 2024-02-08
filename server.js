
import express from 'express';
import pool from './DB.js';
const port = 8000;

const app = express();
app.use(express.json());


//routes
app.get('/', async (req, res) => {
    try {
        const data = await pool.query('SELECT * FROM schools')
        res.status(200).send(data.rows)
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

app.post('/', async (req, res) => {
    const { name, address } = req.body
    try {
        if (address) { // Check if address is provided
            await pool.query('INSERT INTO schools (name, address) VALUES ($1, $2)', [name, address]);
            console.log("Successfully added school");
            res.status(200).send({ message: "Successfully added school" })
        } else {
            res.status(400).send({ message: "Address is required" })
        }

    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

app.listen(port, () => {
    console.log(`Server at http://localhost:${port}`);
});


export default app;