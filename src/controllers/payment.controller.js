// const axios = require("axios");
// const Payment = require("../models/feeModel");
// const generateReceiptPDF = require("../utils/generateReceiptPDF");
import axios from 'axios';
import Fee from '../models/Fee.js'
// import Payment from '../models/Payment.js';
import Parent from '../models/Parent.js';
import generateReceiptPDF from '../utils/generateReceiptPDF.js'
import User from '../models/User.js';

const initializePayment = async (req, res) => {
  try {
    const { email, amount, term, session } = req.body;
    const id = req.user.id;
    console.log(id);
    const parentUser = await Parent.findOne({ userId:id });
    const childId = parentUser.children.toString();
    const studentId = childId;    
    
    if (!studentId || !email || !amount || !term || !session)
      return res.status(400).json({ error: "All fields are required" });
    console.log("done");

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: amount * 100, // Paystack uses kobo
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const { reference, authorization_url } = response.data.data;

    // Save payment in DB with pending status
    let feesPaid = await Fee.create({
      studentId,
      amount,
      reference,
      term,
      session,
      status: "pending"
    });

    feesPaid = await Fee.findById(feesPaid._id).populate("studentId");

    res.status(200).json({
      message: "Payment initialized",
      authorization_url,
      reference,
      feesPaid
    });
    console.log({
      message: "Payment initialized",
      authorization_url,
      reference,
      feesPaid
    });
    
  } catch (error) {
    console.error("Error initializing payment:", error?.response?.data || error.message);
    res.status(500).json({ error: "Failed to initialize payment" });
  }
};

const verifyPayment = async (req, res) => {
  const { reference } = req.params;
  console.log(reference);
  console.log(process.env.PAYSTACK_SECRET_KEY);
  
  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );
    
    const data = response.data.data;
    console.log(data);
    

    const payment = await Fee.findOne({ reference });

    if (!payment)
      return res.status(404).json({ error: "Payment record not found" });

    payment.status = data.status;
    payment.paidAt = data.paid_at;
    await payment.save();

    res.status(200).json({
      message: `Payment ${data.status}`,
      payment
    });
    console.log(res);
    
  } catch (error) {
    console.error("Verification failed:", error?.response?.data || error.message);
    res.status(500).json({ error: "Failed to verify payment" });
  }
};

const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("studentId", "fullname admission_number studentClass") // only needed fields
      .sort({ createdAt: -1 }); // optional: show newest first

    res.status(200).json({ message: "Payments fetched", payments });
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getFilteredPayments = async (req, res) => {
  try {
    const { studentId, term, session, status } = req.query;

    // Build filter object dynamically
    const filter = {};
    if (studentId) filter.studentId = studentId;
    if (term) filter.term = term;
    if (session) filter.session = session;
    if (status) filter.status = status;

    const payments = await Payment.find(filter)
      .populate("studentId", "fullname admission_number studentClass")
      .sort({ createdAt: -1 });

    res.status(200).json({ message: "Filtered payments fetched", payments });
  } catch (error) {
    console.error("Error fetching filtered payments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const downloadReceiptPDF = async (req, res) => {
  try {
    const { reference } = req.params;

    const payment = await Payment.findOne({ reference }).populate("studentId");
    if (!payment) return res.status(404).json({ error: "Payment not found" });

    const student = payment.studentId;
    generateReceiptPDF(payment, student, res);
  } catch (error) {
    console.error("PDF Receipt Error:", error);
    res.status(500).json({ error: "Failed to generate receipt PDF" });
  }
};

export {
  initializePayment,
  verifyPayment,
  getAllPayments,
  getFilteredPayments,
  downloadReceiptPDF
};