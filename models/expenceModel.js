import mongoose from 'mongoose';

const expenceSchema = new mongoose.Schema({
user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
title: { type: String, required: true },
amount: { type: Number, required: true },
category: { type: String, default: 'Other' },
date: { type: Date, default: Date.now },
}, { timestamps: true });

const Expence = mongoose.model('Expense', expenceSchema);
export default Expence;




