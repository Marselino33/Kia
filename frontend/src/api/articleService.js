import adminApi from '../lib/adminApi';

export const articleService = {
  // GET /admin/content with pagination & search
  getArticles: async (page = 1, limit = 10, search = '') => {
    const res = await adminApi.get('/admin/content', {
      params: { page, limit, search }
    });
    return res.data;
  },
  
  // POST /admin/content
  createArticle: async (data) => {
    const res = await adminApi.post('/admin/content', data);
    return res.data;
  },
  
  // PUT /admin/content/:id
  updateArticle: async (id, data) => {
    const res = await adminApi.put(`/admin/content/${id}`, data);
    return res.data;
  },
  
  // DELETE /admin/content/:id
  deleteArticle: async (id) => {
    const res = await adminApi.delete(`/admin/content/${id}`);
    return res.data;
  }
};
