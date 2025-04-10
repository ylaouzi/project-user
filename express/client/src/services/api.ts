import axios from 'axios';

const API_URL = 'http://localhost:3000'; // URL de ton backend Express

export const getUsers = async () => {
  const res = await axios.get(`${API_URL}/users`);
  return res.data;
};

export const createUser = async (user: { name: string; email: string }) => {
  const res = await axios.post(`${API_URL}/users`, user);
  return res.data;
};
