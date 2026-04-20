import api from './api';

export const contentService = {
  // Get all content
  getContent: async (params = {}) => {
    const res = await api.get('/content', { params });
    return res.data?.data || [];
  },

  // Get content by slug
  getContentBySlug: async (slug) => {
    const res = await api.get(`/content/${slug}`);
    return res.data?.data;
  },

  // Parenting / Stimulus Anak
  getParenting: async () => {
    const res = await api.get('/parenting');
    return res.data?.data || [];
  },

  getParentingBySlug: async (slug) => {
    const res = await api.get(`/parenting/${slug}`);
    return res.data?.data;
  },

  // Pola Asuh
  getPolaAsuh: async () => {
    const res = await api.get('/pola-asuh');
    return res.data?.data || [];
  },

  getPolaAsuhBySlug: async (slug) => {
    const res = await api.get(`/pola-asuh/${slug}`);
    return res.data?.data;
  },

  // Gizi Ibu
  getGiziIbu: async () => {
    const res = await api.get('/gizi/ibu');
    return res.data?.data || [];
  },

  getGiziIbuBySlug: async (slug) => {
    const res = await api.get(`/gizi/ibu/${slug}`);
    return res.data?.data;
  },

  // Gizi Anak
  getGiziAnak: async () => {
    const res = await api.get('/gizi/anak');
    return res.data?.data || [];
  },

  getGiziAnakBySlug: async (slug) => {
    const res = await api.get(`/gizi/anak/${slug}`);
    return res.data?.data;
  },

  // MPASI / Resep
  getMpasi: async () => {
    const res = await api.get('/gizi/resep');
    return res.data?.data || [];
  },

  getMpasiBySlug: async (slug) => {
    const res = await api.get(`/gizi/resep/${slug}`);
    return res.data?.data;
  },

  // Informasi Umum
  getInformasiUmum: async () => {
    const res = await api.get('/informasi-umum');
    return res.data?.data || [];
  },

  getInformasiUmumBySlug: async (slug) => {
    const res = await api.get(`/informasi-umum/${slug}`);
    return res.data?.data;
  },

  // Mental Orang Tua
  getMentalOrangTua: async () => {
    const res = await api.get('/mental-orang-tua');
    return res.data?.data || [];
  },

  getMentalOrangTuaBySlug: async (slug) => {
    const res = await api.get(`/mental-orang-tua/${slug}`);
    return res.data?.data;
  },
};