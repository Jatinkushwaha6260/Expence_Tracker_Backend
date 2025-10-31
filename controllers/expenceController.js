import Expence from '../models/expenceModel.js';

// POST — Create Expense
export const createExpence = async (req, res) => {
try {
const { title, amount, category, date } = req.body;
if (!title || !amount) return res.status(400).json({ message: 'Title and amount are required' });

const expence = new Expence({
user: req.user._id,
title,
amount,
category,
date,
});


await expence.save();
res.status(201).json(expence);
} catch (err) {
res.status(500).json({ message: err.message });
}
};


// GET — Fetch expenses (filter by category/date)
export const getExpences = async (req, res) => {0
try {
const { category, startDate, endDate } = req.query;
const filter = { user: req.user._id };


if (category) filter.category = category;
if (startDate || endDate) filter.date = {};
if (startDate) filter.date.$gte = new Date(startDate);
if (endDate) filter.date.$lte = new Date(endDate);


const expences = await Expense.find(filter).sort({ date: -1 });
res.json(expences);
} catch (err) {
res.status(500).json({ message: err.message });
}
};


// PUT — Edit Expense
export const updateExpence = async (req, res) => {
try {
const expence = await Expence.findOne({ _id: req.params.id, user: req.user._id });
if (!expence) return res.status(404).json({ message: 'Expense not found' });


expence.title = req.body.title || expence.title;
expence.amount = req.body.amount || expence.amount;
expence.category = req.body.category || expence.category;
expence.date = req.body.date || expence.date;


const updated = await expence.save();
res.json(updated);
} catch (err) {
res.status(500).json({ message: err.message });
}
};

// DELETE — Delete Expense
export const deleteExpence = async (req, res) => {
try {
const expence = await Expence.findOneAndDelete({ _id: req.params.id, user: req.user._id });
if (!expence) return res.status(404).json({ message: 'Expense not found' });
res.json({ message: 'Expense deleted successfully' });
} catch (err) {
res.status(500).json({ message: err.message });
}
};










