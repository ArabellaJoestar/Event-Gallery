fetch('http://localhost:3472/6', {
  method: 'DELETE',
})
  .then(response => {
    if (!response.ok) {
      throw new Error('Erro ao deletar o evento');
    }
    return response.json();
  })
  .then(data => {
    console.log('Evento deletado com sucesso:', data);
  })
  .catch(error => {
    console.error('Erro ao deletar o evento:', error);
  });

  fetch('http://localhost:3472/7', {
  method: 'DELETE',
})
  .then(response => {
    if (!response.ok) {
      throw new Error('Erro ao deletar o evento');
    }
    return response.json();
  })
  .then(data => {
    console.log('Evento deletado com sucesso:', data);
  })
  .catch(error => {
    console.error('Erro ao deletar o evento:', error);
  });
