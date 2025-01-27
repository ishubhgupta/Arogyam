import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import pool from '../config/db.js';
import { generateVerificationToken } from '../utils/generateVerificationToken.js';
import { generateJWTToken } from '../utils/generateJWTToken.js';
import { sendConfirmationEmail, sendResetPasswordEmail, sendResetPasswordSuccessEmail, sendVerificationEmail } from '../resend/email.js';

export const signup = async (req, res) => {
  const { firstName, lastName, email, password, address, city, state, pincode, phoneNumber } = req.body;
  try {
    if (!firstName || !lastName || !email || !password || !address || !city || !state || !pincode || !phoneNumber) {
      return res.status(400).json({ success: false, message: 'Enter all fields' });
    }

    // Check if patient already exists
    const patientAlreadyExists = await pool.query('SELECT * FROM patients WHERE email = $1', [email]);
    if (patientAlreadyExists.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Patient already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = generateVerificationToken();

    // Insert patient record into database
    const result = await pool.query(
      `INSERT INTO patients (first_name, last_name, email, password, address, city, state, pincode, phone_number, verification_token, verification_token_expires_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [firstName, lastName, email, hashedPassword, address, city, state, pincode, phoneNumber, verificationToken, Date.now() + 24 * 60 * 60 * 1000]
    );

    const patient = result.rows[0];

    // Send verification email
    await sendVerificationEmail(patient.email, verificationToken);

    return res.status(201).json({
      success: true,
      message: 'Patient registered successfully!',
      patient: {
        ...patient,
        password: undefined, 
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find patient by email
    const result = await pool.query('SELECT * FROM patients WHERE email = $1', [email]);
    const patient = result.rows[0];

    if (!patient) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Compare password
    const verifyPassword = await bcrypt.compare(password, patient.password);
    if (!verifyPassword) {
      return res.status(400).json({ success: false, message: 'Invalid Password' });
    }

    if (!patient.is_verified) {
      return res.status(400).json({ success: false, message: 'Please verify your email' });
    }

    generateJWTToken(res, patient.id, patient.email);

    return res.status(200).json({ success: true, message: 'Login successful!' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  res.clearCookie('token').status(200).json({ success: true, message: 'Logout Successful' });
};

export const verifyEmail = async (req, res) => {
  const { otp } = req.body;
  try {
    // Find patient by verification token
    const result = await pool.query('SELECT * FROM patients WHERE verification_token = $1 AND verification_token_expires_at > $2', [otp, Date.now()]);
    const patient = result.rows[0];

    if (!patient) {
      return res.status(400).json({ success: false, message: 'Invalid or expired verification code' });
    }

    // Mark patient as verified
    await pool.query('UPDATE patients SET is_verified = true, verification_token = NULL, verification_token_expires_at = NULL WHERE id = $1', [patient.id]);

    // Send confirmation email
    await sendConfirmationEmail(patient.email, patient.first_name);

    return res.status(200).json({ success: true, message: 'Email verified successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const forgetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    // Find patient by email
    const result = await pool.query('SELECT * FROM patients WHERE email = $1', [email]);
    const patient = result.rows[0];

    if (!patient) {
      return res.status(400).json({ success: false, message: 'Patient not found' });
    }

    // Generate a new reset password token using uuid
    const resetPasswordToken = uuidv4();  
    const resetPasswordExpiresAt = Date.now() + 1 * 60 * 60 * 1000;

    // Update reset password token and expiration time
    await pool.query('UPDATE patients SET reset_password_token = $1, reset_password_expires_at = $2 WHERE id = $3', [resetPasswordToken, resetPasswordExpiresAt, patient.id]);

    await sendResetPasswordEmail(patient.email, `${process.env.CLIENT_URL}/reset-password/${resetPasswordToken}`);

    return res.status(200).json({ success: true, message: 'Reset password link sent to your email' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const token = req.params.token;
  const { newPassword } = req.body;
  try {
    // Find patient by reset password token
    const result = await pool.query('SELECT * FROM patients WHERE reset_password_token = $1 AND reset_password_expires_at > $2', [token, Date.now()]);
    const patient = result.rows[0];

    if (!patient) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset password link' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset token
    await pool.query('UPDATE patients SET password = $1, reset_password_token = NULL, reset_password_expires_at = NULL WHERE id = $2', [hashedPassword, patient.id]);

    await sendResetPasswordSuccessEmail(patient.email);

    return res.status(200).json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const resendVerificationToken = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const result = await pool.query('SELECT * FROM patients WHERE email = $1', [email]);
    const patient = result.rows[0];

    if (!patient) {
      return res.status(400).json({ success: false, message: 'Patient not found' });
    }

    if (patient.is_verified) {
      return res.status(400).json({ success: false, message: 'Email is already verified' });
    }

    const newVerificationToken = generateVerificationToken();

    await pool.query('UPDATE patients SET verification_token = $1, verification_token_expires_at = $2 WHERE id = $3', [newVerificationToken, Date.now() + 24 * 60 * 60 * 1000, patient.id]);

    await sendVerificationEmail(patient.email, newVerificationToken);

    return res.status(200).json({ success: true, message: 'New verification token sent to your email' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const checkAuth = async (req, res) => {
  try {
    // Find patient by ID
    const result = await pool.query('SELECT * FROM patients WHERE id = $1', [req.patientId]);
    const patient = result.rows[0];

    if (!patient) {
      return res.status(400).json({ success: false, message: 'Patient not found' });
    }

    return res.status(200).json({ success: true, patient: { ...patient, password: undefined } });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
