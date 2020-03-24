import nodemailer from 'nodemailer';
import { sendGridConfig } from '../config/index';

const client = nodemailer.createTransport({
  service: 'SendGrid',
  auth: {
    user: sendGridConfig.username,
    pass: sendGridConfig.password,
  },
});

export default {
  // eslint-disable-next-line arrow-body-style
  sendEmail: (from, to, subject, html) => {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line object-curly-newline
      client.sendMail({ from, subject, to, html }, (err, info) => {
        if (err) reject(err);
        else resolve(info);
      });
    });
  },
};
