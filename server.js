import { MongoClient, ServerApiVersion } from "mongodb";

import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import User from './models/user.js';

const app = express();

app.use(bodyParser.json());
const uri = "mongodb+srv://tahani:DRungkF6BYfBQnA1@cluster0.hfvhr.mongodb.net/medhub?retryWrites=true&w=majority";

mongoose.connect(uri)
    .then(() => {
        console.log("MongoDB connected");

        // Starting the server after the Mongo DB connection has been made
        app.listen(5000, () => {
            console.log("Server running on http://localhost:5000");
        });
    })
    .catch(err => {
        console.error(" MongoDB connection error:", err.message);
    });


const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function run() {
    try {
        console.log("Connecting to MongoDB...");
        await client.connect();
        console.log("Successfully connected!");

    } catch (error) {
        console.error("Connection failed:", error.message);
    } finally {
        await client.close();
        console.log("Connection closed.");
    }
}

run().catch(console.dir);

// Post to register a new user
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const newUser = new User({ name, email, password });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Post to log ina user 
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        res.status(200).json({ message: 'Login successful', user: { name: user.name, email: user.email } });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});
