import PDFDocument from "pdfkit";
import fs from "fs";
import path from 'path';


const fontPath = path.resolve('C:/Users/USER/Desktop/Student Management System/font/Roboto-Regular.ttf');

const generateReceiptPDF = (payment, student, res) => {
  console.log(student);
  
  const doc = new PDFDocument();

  // Set response headers
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `inline; filename=${student?.fullname}-receipt-MYPS.pdf`);

  // Pipe PDF to response
  doc.pipe(res);
  

  // PDF Content
  doc.fontSize(20).text("School Fees Receipt", { align: "center" });
  doc.moveDown();

  doc.fontSize(12).text(`Receipt Reference: ${payment.reference}`);
  doc.text(`Date: ${new Date(payment.createdAt).toLocaleDateString()}`);
  doc.moveDown();

  doc.text(`Student Name: ${student?.fullname}`);
  doc.text(`Admission Number: ${student.admission_number}`);
  doc.text(`Class: ${student.studentClass}`);
  doc.moveDown();

  // Register a font that supports ₦
doc.registerFont('Roboto', fontPath);

  doc.text(`Term: ${payment.term}`);
  doc.text(`Session: ${payment.session}`);
  doc.font('Roboto').text(`Amount Paid: ₦ ${payment.amount.toLocaleString()}`);
  doc.text(`Status: ${payment.status}`);
  doc.text(`Paid At: ${payment.paidAt ? new Date(payment.paidAt).toLocaleString() : "Pending"}`);
  doc.moveDown();

  doc.text("Thank you for your payment.", { align: "center" });

  doc.end(); // Finalize PDF
};

export default generateReceiptPDF;
