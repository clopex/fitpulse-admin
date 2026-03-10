import { api } from '@/lib/axios';
export const getSubscriptionsApi = async (page = 1, limit = 20) => {
  const res = await api.get('/subscriptions', { params: { page, limit } });
  return res.data;
};
export const getSubscriptionStatsApi = async () => {
  const res = await api.get('/subscriptions/stats');
  return res.data;
};
