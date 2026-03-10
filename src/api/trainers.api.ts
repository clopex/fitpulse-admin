import { api } from '@/lib/axios';
export const getTrainersApi = async (page = 1, limit = 20) => {
  const res = await api.get('/trainers', { params: { page, limit } });
  return res.data;
};
export const createTrainerApi = async (data: { user_id: string; bio?: string; specialization?: string[] }) => {
  const res = await api.post('/trainers', data);
  return res.data;
};
export const deleteTrainerApi = async (id: string) => {
  const res = await api.delete(`/trainers/${id}`);
  return res.data;
};
