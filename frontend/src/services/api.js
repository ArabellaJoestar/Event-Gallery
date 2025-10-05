// services/api.js

const API_URL = 'http://localhost:3472'; // ajuste conforme seu backend

export const eventAPI = {
  // CREATE - Criar novo evento (com envio FormData para incluir imagens)
  async createEvent(formData) {
    console.log(formData)
    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao criar evento');
    }

    return await response.json();
  },

  // READ - Obter todos os eventos
  async getAllEvents() {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Erro ao buscar eventos');
    return await response.json();
  },

  // READ - Obter evento por ID
  async getEventById(id) {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error('Evento não encontrado');
    return await response.json();
  },

  // UPDATE - Atualizar evento (usa FormData, pois pode conteri magens)
  async updateEvent(id, updateData) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      body: updateData,
    });
    if (!response.ok) throw new Error('Erro ao atualizar evento');
    return await response.json();
  },

  // DELETE - Deletar evento
  async deleteEvent(id) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Erro ao deletar evento');
    return await response.json();
  }
};
