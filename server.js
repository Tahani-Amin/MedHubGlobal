
// Imported all the libs and pacakages
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { registerUser, loginUser } from './controllers/authController.js';

const app = express();
app.use(bodyParser.json());

const uri = 'mongodb+srv://tahani:DRungkF6BYfBQnA1@cluster0.hfvhr.mongodb.net/medhub?retryWrites=true&w=majority';

mongoose.connect(uri)
    .then(() => {
        console.log("✅ MongoDB connected");
        app.listen(5000, () => console.log(" Server is running on http://localhost:5000"));
    })
    .catch(err => console.error("MongoDB connection error:", err.message));

// Routes using the controller logic
app.post('/register', registerUser);
app.post('/login', loginUser);
