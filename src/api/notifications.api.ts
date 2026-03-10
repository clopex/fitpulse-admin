import { api } from '@/lib/axios';
export const sendNotificationApi = async (data: {
  user_id?: string; user_ids?: string[];
  type: string; title: string; body?: string;
}) => {
  const res = await api.post('/notifications/send', data);
  return res.data;
};
