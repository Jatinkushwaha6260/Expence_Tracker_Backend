import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '30d' });

export const registerUser = async (req, res) => {
const { name, email, password } = req.body;
if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });
try{

    
const existingUser = await User.findOne({ email });
if (existingUser) return res.status(400).json({ message: 'User already exists' });

const user = await User.create({ name, email, password });
res.status(201).json({
_id: user._id,
name: user.name,
email: user.email,
token: generateToken(user._id),
});
}catch(err){
    console.error(err);
    res.status(500).json({ error: 'Server error' });
}
};

export const loginUser = async (req, res) => {
const { email, password } = req.body;
try{


const user = await User.findOne({ email });
if (user && (await user.matchPassword(password))) {
res.json({
_id: user._id,
name: user.name,
email: user.email,
token: generateToken(user._id),
});
} else {
res.status(401).json({ message: 'Invalid email or password' });
}
}catch(err){
    console.error(err);
    res.status(500).json({ error: 'Server error' });
}
};













