import { api } from '@/lib/axios';
export const getUsersApi = async (page = 1, limit = 20) => {
  const res = await api.get('/users', { params: { page, limit } });
  return res.data;
};
export const toggleUserActiveApi = async (id: string, is_active: boolean) => {
  const res = await api.patch(`/users/${id}/toggle`, { is_active });
  return res.data;
};
export const deleteUserApi = async (id: string) => {
  const res = await api.delete(`/users/${id}`);
  return res.data;
};
