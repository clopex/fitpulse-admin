import { api } from '@/lib/axios';
export const getClassesApi = async (page = 1, limit = 20) => {
  const res = await api.get('/classes', { params: { page, limit } });
  return res.data;
};
export const createClassApi = async (data: object) => {
  const res = await api.post('/classes', data);
  return res.data;
};
export const cancelClassApi = async (id: string) => {
  const res = await api.patch(`/classes/${id}/cancel`);
  return res.data;
};
export const deleteClassApi = async (id: string) => {
  const res = await api.delete(`/classes/${id}`);
  return res.data;
};
