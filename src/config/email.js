import emailjs from '@emailjs/nodejs';
import config from './index.js';

export const sendTemplateEmail = async ({ toEmail, templateParams }) => {
  if (!config.email.serviceId) {
    console.warn('Email service not configured; skipping send.');
    return;
  }

  await emailjs.send(
    config.email.serviceId,
    config.email.templateId,
    { to_email: toEmail, ...templateParams },
    { publicKey: config.email.publicKey }
  );
};
