import { axiosPatient } from '../utils/axiosConfig';

export const getPatientDetails = async () => {
  // Change from '/details' to '/profile' to match backend route
  return await axiosPatient.get('/info');
};

export const updatePatientDetails = async (data) => {
  // Change from '/details' to '/profile' to match backend route
  return await axiosPatient.put('/info', data);
};