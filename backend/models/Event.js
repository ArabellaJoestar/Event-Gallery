// models/Event.js
import pool from '../config/database.js';

// Função auxiliar para datas (MySQL prefere YYYY-MM-DD)
const getISODate = () => new Date().toISOString().split('T')[0];

export class Event {

  static async create(eventData) {
    const { name, description, principal_photo, date_event, group_id, imagePaths, documentPaths } = eventData;
    

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Prepara dados do evento
      const date_creation = getISODate();
      const id_req = `REQ-${Date.now()}`;
      
      const sqlEvent = `
        INSERT INTO events (id_req, name, images, documents, description, principal_photo, date_creation, date_event, group_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const paramsEvent = [
        id_req, name, JSON.stringify(imagePaths), JSON.stringify(documentPaths),
        description, principal_photo, date_creation, date_event, group_id || null
      ];

      // Inserção do evento
      const [result] = await connection.query(sqlEvent, paramsEvent);
      const newEventId = result.insertId;

      // Se tiver group_id, atualiza o array de eventos do grupo
      if (group_id) {
        const sqlGetGroup = `SELECT events FROM event_groups WHERE id = ? FOR UPDATE`;
        const [rows] = await connection.query(sqlGetGroup, [group_id]);
        
        if (rows.length > 0) {
          const currentEvents = rows[0].events || [];
          const updatedEvents = [...currentEvents, newEventId];
          
          const sqlUpdateGroup = `UPDATE event_groups SET events = ? WHERE id = ?`;
          await connection.query(sqlUpdateGroup, [JSON.stringify(updatedEvents), group_id]);
        }
      }

      // Se tudo deu certo, commita
      await connection.commit();

      // Retorna o evento criado
      return { 
        id: newEventId, id_req, name, description, principal_photo, date_event, group_id,
        images: imagePaths, documents: documentPaths, date_creation 
      };

    } catch (error) {
      // Se algo deu errado, desfaz tudo
      await connection.rollback();
      throw error; // Propaga o erro para o controller
    } finally {
      connection.release(); // Libera a conexão
    }
  }

  static async findAll(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const sql = `
      SELECT * FROM events
      WHERE date_deletion IS NULL
      ORDER BY date_creation DESC
      LIMIT ? OFFSET ?
    `;
    const [rows] = await pool.query(sql, [limit, offset]);

    return rows.map(e =>({
      ...e,
      images: e.images || [],
      documents: e.documents || []
    }));
  }

  static async findById(id) {
    const sql = `SELECT * FROM events WHERE id = ? AND date_deletion IS NULL`;
    const [rows] = await pool.query(sql, [id]);
    const event = rows[0]
    
    if(event){
      event.images = event.images || [];
      event.documents = event.documents || []
    }
    return event
  }

  static async update(id, eventData) {
    // 1. Receber o group_id
    const { name, description, principal_photo, date_event, group_id, finalImages, finalDocuments } = eventData;

    const connection = await pool.getConnection(); // Precisamos de transação
    try {
      await connection.beginTransaction();

      // 2. Pegar dados antigos
      const [rows] = await connection.query("SELECT * FROM events WHERE id = ? FOR UPDATE", [id]);
      if (rows.length === 0) throw new Error('Evento não encontrado');
      const oldEvent = rows[0];

      // 3. Merge dos dados
      const updatedName = name || oldEvent.name;
      const updatedDescription = description || oldEvent.description;
      const updatedPrincipalPhoto = principal_photo !== undefined ? parseInt(principal_photo) : oldEvent.principal_photo;
      
      // Lógica de data (essencial para evitar o bug do fuso)
      let formattedDateEvent = date_event || oldEvent.date_event;
      if (formattedDateEvent && typeof formattedDateEvent === 'string' && formattedDateEvent.includes('T')) {
        formattedDateEvent = formattedDateEvent.split('T')[0];
      }
      const updatedDateEvent = formattedDateEvent;

      // Lógica de group_id
      const oldGroupId = oldEvent.group_id;
      // Se group_id for undefined (não enviado), manter o antigo.
      // Se for "" (string vazia de "nenhum"), salvar NULL.
      const updatedGroupId = (group_id === undefined) ? oldGroupId : (group_id || null);

      const updatedImages = finalImages ? JSON.stringify(finalImages) : oldEvent.images;
      const updatedDocuments = finalDocuments ? JSON.stringify(finalDocuments) : oldEvent.documents;

      // 4. ATUALIZAR A TABELA 'events'
      const sqlUpdateEvent = `
        UPDATE events 
        SET name = ?, images = ?, documents = ?, description = ?, 
            principal_photo = ?, date_event = ?, group_id = ?
        WHERE id = ?
      `;
      const paramsEvent = [
        updatedName, updatedImages, updatedDocuments, updatedDescription,
        updatedPrincipalPhoto, updatedDateEvent, updatedGroupId,
        id
      ];
      await connection.query(sqlUpdateEvent, paramsEvent);

      // 5. ATUALIZAR A TABELA 'event_groups' (SE O GRUPO MUDOU)
      if (oldGroupId !== updatedGroupId) {
        const eventId = parseInt(id);

        // 5a. Remover do grupo antigo (se havia um)
        if (oldGroupId) {
          const sqlGetOldGroup = `SELECT events FROM event_groups WHERE id = ? FOR UPDATE`;
          const [oldGroupRows] = await connection.query(sqlGetOldGroup, [oldGroupId]);
          if (oldGroupRows.length > 0) {
            const oldGroupEvents = oldGroupRows[0].events || [];
            const newOldGroupEvents = oldGroupEvents.filter(eId => eId !== eventId);
            await connection.query("UPDATE event_groups SET events = ? WHERE id = ?", [JSON.stringify(newOldGroupEvents), oldGroupId]);
          }
        }

        // 5b. Adicionar ao grupo novo (se há um)
        if (updatedGroupId) {
          const sqlGetNewGroup = `SELECT events FROM event_groups WHERE id = ? FOR UPDATE`;
          const [newGroupRows] = await connection.query(sqlGetNewGroup, [updatedGroupId]);
          if (newGroupRows.length > 0) {
            const newGroupEvents = newGroupRows[0].events || [];
            if (!newGroupEvents.includes(eventId)) {
              newGroupEvents.push(eventId);
              await connection.query("UPDATE event_groups SET events = ? WHERE id = ?", [JSON.stringify(newGroupEvents), updatedGroupId]);
            }
          }
        }
      }

      // 6. COMMIT
      await connection.commit();

      // 7. RETORNO
      return { 
        id: parseInt(id), name: updatedName, description: updatedDescription, 
        principal_photo: updatedPrincipalPhoto, date_event: updatedDateEvent,
        group_id: updatedGroupId, // Retornar o novo group_id
        images: finalImages || oldEvent.images, 
        documents: finalDocuments || oldEvent.documents
      };

    } catch (error) {
      await connection.rollback();
      throw error; // Propaga o erro para o controller
    } finally {
      connection.release();
    }
  }
  
  static async softDelete(id) {
    const date_deletion = getISODate();
    const sql = `UPDATE events SET date_deletion = ? WHERE id = ?`;
    const [result] = await pool.query(sql, [date_deletion, id]);
    return result.affectedRows; // Retorna 0 ou 1
  }
}