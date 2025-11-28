import express from "express";
import { initializePayment, verifyPayment, getAllPayments, getFilteredPayments, downloadReceiptPDF } from "../controllers/payment.controller.js";
// import
import {authenticate} from "../middleware/auth.js";
const router = express.Router();


router.post("/initialize",authenticate, initializePayment);
router.get("/verify/:reference", verifyPayment);
router.get("/getallpayment",authenticate, getAllPayments);
router.get("/filter",authenticate, getFilteredPayments);
router.get("/receipt/:reference", authenticate, downloadReceiptPDF);



export default router;
