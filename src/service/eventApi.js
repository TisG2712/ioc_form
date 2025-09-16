import { publicApi } from './apiClient'; 

export const getAllEvents = async (page = 0, size = 10) => {
  try {
    const response = await publicApi.get('/api/events/all', {
      params: { page, size },
    });
    return response.data.body;
  } catch (error) {
    // console.error('Lỗi khi lấy danh sách sự kiện:', error);
    // throw error;
  }
};

// Tạo sự kiện mới
export const createEvent = async (eventData) => {
  try {
    const response = await api.post('/api/events', eventData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tạo sự kiện mới:', error);
    throw error;
  }
};

// Cập nhật sự kiện
export const updateEvent = async (id, eventData) => {
  try {
    const response = await api.put(`/api/events/update/${id}`, eventData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật sự kiện:', error);
    throw error;
  }
};

// Cập nhật trạng thái sự kiện
export const updateStatus = async (id, status) => {
  try {
    const response = await api.put(`/api/events/update-status/${id}`, { status });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái:', error);
    throw error;
  }
};

// Xóa sự kiện
export const deleteEvent = async (id) => {
  try {
    const response = await api.delete(`/api/events/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi xóa sự kiện:', error);
    throw error;
  }
};

// Lấy sự kiện theo ID
export const getEventById = async (id) => {
  try {
    const response = await publicApi.get(`/api/events/search/${id}`);
    return response.data.body;
  } catch (error) {
    // console.error('Lỗi khi lấy sự kiện theo ID:', error);
    // throw error;
  }
};