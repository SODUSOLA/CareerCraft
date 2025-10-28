import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendWelcomeEmail = async (email, username) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Welcome to CareerCraft!',
        html: `
            <h1>Welcome, ${username}!</h1>
            <p>Thank you for registering with CareerCraft. We're excited to help you craft your career path with insights from Industry experts.</p>
            <p>Get started by exploring our features!</p>
            <br>
            <p>Best regards,<br>The CareerCraft Team</p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Welcome email sent to', email);
    } catch (error) {
        console.error('Error sending welcome email:', error);
        throw error;
    }
};

export const sendResetCodeEmail = async (email, resetCode) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset Code - CareerCraft',
        html: `
            <h1>Password Reset</h1>
            <p>You requested a password reset for your CareerCraft account.</p>
            <p>Your reset code is: <strong>${resetCode}</strong></p>
            <p>This code will expire in 15 minutes.</p>
            <p>If you didn't request this, please ignore this email.</p>
            <br>
            <p>Best regards,<br>The CareerCraft Team</p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Reset code email sent to', email);
    } catch (error) {
        console.error('Error sending reset code email:', error);
        throw error;
    }
};
