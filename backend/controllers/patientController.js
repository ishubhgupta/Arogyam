import pool from '../config/db.js'; // PostgreSQL connection pool

export const getpatientDetails = async (req, res) => {
  try {
    // Fetch patient details by patient ID
    const result = await pool.query('SELECT * FROM patients WHERE id = $1', [req.patientId]);
    const patient = result.rows[0];

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    const { password, ...patientDetails } = patient;

    return res.status(200).json({ success: true, patient: patientDetails });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updatepatientDetails = async (req, res) => {
  const { firstName, lastName, address, city, state, pincode, phoneNumber } = req.body;
  try {
    // Check if the patient exists
    const result = await pool.query('SELECT * FROM patients WHERE id = $1', [req.patientId]);
    const patient = result.rows[0];

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    // Update patient details
    await pool.query(
      `UPDATE patients
       SET first_name = $1, last_name = $2, address = $3, city = $4, state = $5, pincode = $6, phone_number = $7, updated_at = NOW()
       WHERE id = $8`,
      [
        firstName || patient.first_name,
        lastName || patient.last_name,
        address || patient.address,
        city || patient.city,
        state || patient.state,
        pincode || patient.pincode,
        phoneNumber || patient.phone_number,
        req.patientId,
      ]
    );

    return res.json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};
