import { api } from '@/lib/axios';
export const loginApi = async (email: string, password: string) => {
  const res = await api.post('/auth/login', { email, password });
  return res.data;
};
