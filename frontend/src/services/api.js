const API_URL = 'http://localhost:3472';

export const eventAPI = {
  async createEvent(formData) {
    const token = localStorage.getItem("token");
    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData,
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao criar evento');
    }
    return await response.json();
  },

  async getAllEvents() {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Erro ao buscar eventos');
    return await response.json();
  },

  async getEventById(id) {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error('Evento não encontrado');
    return await response.json();
  },

  async updateEvent(id, updateData) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      body: updateData,
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Erro ao atualizar evento');
    return await response.json();
  },

  async deleteEvent(id) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Erro ao deletar evento');
    return await response.json();
  }
};
