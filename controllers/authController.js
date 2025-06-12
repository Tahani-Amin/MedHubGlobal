import User from '../models/user.js';

// registers a new user
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const user = new User({ name, email, password });
        await user.save();

        res.status(201).json({ message: 'Account created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong. Please try again.', error: error.message });
    }
};

// logs in an existing user
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Incorrect email or password' });
        }

        const isCorrect = await user.comparePassword(password);
        if (!isCorrect) {
            return res.status(400).json({ message: 'Incorrect email or password' });
        }

        res.status(200).json({ message: 'Logged in successfully', user: { name: user.name, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong. Please try again.', error: error.message });
    }
};
