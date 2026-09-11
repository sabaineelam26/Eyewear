import { adminApi } from '../context/AdminAuthContext';

export const fetchAdminProducts = async (search = '', category = '') => {
    // Modify URL if your backend supports search/filter directly, or filter on client
    const { data } = await adminApi.get(`/products?keyword=${search}&category=${category}`);
    return data;
};

export const fetchAdminProductById = async (id) => {
    const { data } = await adminApi.get(`/products/${id}`);
    return data;
};

export const createProduct = async (productData) => {
    const { data } = await adminApi.post('/products', productData);
    return data;
};

export const updateProduct = async (id, productData) => {
    const { data } = await adminApi.put(`/products/${id}`, productData);
    return data;
};

export const deleteProduct = async (id) => {
    const { data } = await adminApi.delete(`/products/${id}`);
    return data;
};

export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const { data } = await adminApi.post('/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return data;
};

export const fetchAdminCategories = async () => {
    const { data } = await adminApi.get('/categories');
    return data;
};

// Orders
export const fetchAdminOrders = async () => {
    const { data } = await adminApi.get('/admin/orders');
    return data;
};

export const fetchAdminOrderDetails = async (id) => {
    const { data } = await adminApi.get(`/admin/orders/${id}`);
    return data;
};

export const updateOrderStatus = async (id, statusData) => {
    // statusData: { orderStatus, paymentStatus }
    const { data } = await adminApi.put(`/admin/orders/${id}/status`, statusData);
    return data;
};

// Inventory (Direct Stock Update)
export const updateProductStock = async (id, stockData) => {
    // Reusing the main product update route, but passing only stock
    const { data } = await adminApi.put(`/products/${id}`, stockData);
    return data;
};
