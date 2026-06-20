import React, { useState, useEffect } from 'react';
import { CalendarEvent } from '../../pages/calendar/CalendarPage';


// Структура одного участника
interface EventParticipantDto {
  id: number;
  login: string;
}

// Интерфейс для данных, отправляемых при редактировании
interface EditEventFormData {
  id: number;
  title: string;
  description: string | null;
}

// Пропсы компонента
interface EditEventModalProps {
  isOpen: boolean;
  event: CalendarEvent | null; // Текущее выбранное событие
  onClose: () => void;
  onUpdate: (formData: EditEventFormData) => void;
  onDelete: (eventId: number) => void;
}

function EditEventModal({ isOpen, event, onClose, onUpdate, onDelete }: EditEventModalProps) {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  // Синхронизируем стейты формы с выбранным событием при его изменении
  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description || '');
    }
  }, [event]);

  if (!isOpen || !event) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('Название события обязательно для заполнения!');
      return;
    }

    onUpdate({
      id: event.id,
      title: title.trim(),
      description: description.trim() || null
    });
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
      justifyContent: 'center', alignItems: 'center', zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#fff', padding: '25px', borderRadius: '8px',
        width: '400px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ fontSize: '1.3em', fontWeight: 'bold', marginBottom: '15px' }}>
          Редактирование события
        </div>
        
        <form onSubmit={handleSubmit}>
          {/* Поле 1: Название */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9em' }}>
              Название события *
            </label>
            <input 
              disabled={!event?.isOwner} 
              type="text" 
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              placeholder="Введите название..."
              autoFocus
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            />
          </div>

          {/* Поле 2: Описание */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9em' }}>
              Описание события
            </label>
            <textarea 
              disabled={!event?.isOwner} 
              value={description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
              placeholder="Добавьте детали..."
              rows={3}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', resize: 'vertical' }}
            />
          </div>

          {/* Поле 3: Список участников события */}
          {event?.isShared && event?.participants && event.participants.length > 0 && (
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9em' }}>
                Участники события
              </label>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.9em', color: '#333' }}>
                {event.participants.map((participant) => (
                  <li key={participant.id} style={{ marginBottom: '4px' }}>
                    {participant.login}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Информационный блок с временем из пропсов */}
          <div style={{ fontSize: '0.85em', color: '#666', marginBottom: '20px', backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '4px' }}>
            <strong>Время проведения:</strong> <br />
            {event.startDate.toLocaleString('ru-RU')} — {event.endDate.toLocaleString('ru-RU')}
          </div>

          {/* Панель кнопок с кнопкой "Удалить" */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Кнопка Удалить слева */}
            {event?.isOwner && (<button 
              type="button" 
              onClick={() => { if(window.confirm('Удалить это событие?')) onDelete(event.id); }}
              style={{ padding: '8px 16px', borderRadius: '3px', border: 'none', backgroundColor: '#dc3545', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Удалить
            </button>)}

            {/* Кнопки Отмена и Сохранить справа */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                type="button" 
                onClick={onClose}
                style={{ padding: '8px 16px', borderRadius: '3px', border: '1px solid #ccc', backgroundColor: '#fff', cursor: 'pointer' }}
              >
                Отмена
              </button>
              {event?.isOwner && (<button 
                type="submit"
                style={{ padding: '8px 16px', borderRadius: '3px', border: 'none', backgroundColor: '#007bff', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Сохранить
              </button>)}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditEventModal;
