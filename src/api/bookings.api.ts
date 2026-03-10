import { api } from '@/lib/axios';
export const getBookingsApi = async (page = 1, limit = 20) => {
  const res = await api.get('/bookings', { params: { page, limit } });
  return res.data;
};
