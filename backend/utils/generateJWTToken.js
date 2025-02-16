import jwt from "jsonwebtoken";
import 'dotenv/config';

export const generateJWTToken = (res, patientId, email) => {
  const payload = {
    patientId,
    email,
  };

  // Set token expiration to 1 hour
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.cookie('token', token, {
    httpOnly: true,
    // secure: process.env.NODE_ENV === 'production',
    // sameSite: 'strict',
    maxAge: 1 * 60 * 60 * 1000, // Set cookie maxAge to 1 hour
  });

  return token;
};
