import axios from 'axios';

const api = axios.create({
    baseURL:'http://localhost:8080',
    timeout: 5000,
});

export const userService = {
    getAll: () => api.get('/user'),
    getById: (userId) => api.get(`/user/${userId}`),
    create: (userData) => api.post('/user', userData),
};

export const followerService = {
    follow: (userId, userToFollowId) => api.post(`/user/${userId}/follow/${userToFollowId}`),
    unfollow: (userId, userIdToUnfollow) => api.post(`/user/${userId}/unfollow/${userIdToUnfollow}`),
    getFollowersCount: (userId) => api.get(`/user/${userId}/followers/count`),
    getFollowersList: (userId, order) => api.get(`/user/${userId}/followers/list`, { params: { order } }),
    getFollowedList: (userId, order) => api.get(`/user/${userId}/followed/list`, { params: { order } }),
};

export const productService = {
    publishPost: (postData) => api.post('/products/publish', postData),
    publishPromoPost: (promoData) => api.post('/products/promo-pub', promoData),
    getFollowedPosts: (userId, order) => api.get(`/product/followed/${userId}/list`, { params: { order } }),    getPromoProductsCount: (userId) => api.get('/products/promo-pub/count', { params: { user_id: userId } }),

};

export default api;
