import { FC, useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ru } from 'date-fns/locale';
import { RRule } from 'rrule'; // Подключаем парсер повторяющихся событий

import { RoutesPaths, AccessTokenKey, RoleKey, UserNameKey } from '../../constants/commonConstants';

import EventModal from '../../components/eventModal/EventModal';
import EditEventModal from '../../components/eventModal/EditEventModal';

import { jwtDecode } from 'jwt-decode';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useNavigate } from 'react-router-dom';

const locales = {
  'ru': ru,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const requests: Promise<any>[] = [];

interface EventParticipantDto {
  id: number;
  login: string;
}

// Модернизированный интерфейс события для React Big Calendar
export interface CalendarEvent {
  id: number;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  isRecurring: boolean;
  rRule?: string;
  creatorId: number;
  isOwner: boolean;
  
  // Добавляем новые поля с бэкенда:
  isShared: boolean;
  participants: EventParticipantDto[] | null; 
}

interface SelectedSlot {
  start: Date;
  end: Date;
}

export const CalendarPage: FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);

  const BASE_URL_MY_EVENTS = 'https://localhost:7045/calendar/my-events';
  const BASE_URL_UPDATE_EVENT = 'https://localhost:7045/calendar/update';
  const BASE_URL_DELETE_EVENT = 'https://localhost:7045/calendar/delete';

  interface DecodedToken {
    [key: string]: any; 
  }

  const [userLogin, setUserLogin] = useState<string>('');

  // Функция загрузки и разворачивания событий
  const fetchMyEvents = async () => {
    try {
      const token = sessionStorage.getItem(AccessTokenKey);
      const response = await fetch(BASE_URL_MY_EVENTS, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (token) {
        const decoded: DecodedToken = jwtDecode(token);
        const login = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
        if (login) setUserLogin(login);
      }

      if (response.ok) {
        const data: {
          id: number,
          title: string,
          description: string,
          startDate: string, 
          endDate: string,
          isRecurring: boolean,
          rRule: string | undefined,
          creatorId: number,
          isOwner: boolean,
          isShared: boolean,
          participants: { id: number, login: string }[],
        }[] = await response.json();

        console.log(data)

        const expandedEvents: CalendarEvent[] = [];

        data.forEach((item) => {
          const originalStart = new Date(item.startDate);
          const originalEnd = new Date(item.endDate);
          // Вычисляем чистую длительность события в миллисекундах
          const duration = originalEnd.getTime() - originalStart.getTime();

          if (item.isRecurring && item.rRule) {
            try {
              // Парсим строку правила (например: "FREQ=DAILY")
              const rule = RRule.fromString(item.rRule);
              
              // Настраиваем правила генерации (берем даты на 2 месяца вперед и назад)
              const options = rule.options;
              options.dtstart = originalStart;
              const updatedRule = new RRule(options);

              const now = new Date();
              const limitStart = new Date(now.getFullYear(), now.getMonth() - 2, 1);
              const limitEnd = new Date(now.getFullYear(), now.getMonth() + 2, 1);

              // Генерируем массив дат начала для серийного события
              const dates = updatedRule.between(limitStart, limitEnd, true);

              dates.forEach((occurrenceDate) => {
                expandedEvents.push({
                  id: item.id, // Общий ID для всей серии
                  title: item.title,
                  description: item.description,
                  startDate: occurrenceDate,
                  endDate: new Date(occurrenceDate.getTime() + duration), // Сдвигаем на длительность
                  isRecurring: true,
                  rRule: item.rRule,
                  creatorId: item.creatorId,
                  isOwner: item.isOwner,
                  isShared: item.isShared,
                  participants: item.participants
                });
              });
            } catch (rruleError) {
              console.error('Ошибка парсинга RRule для события:', item.id, rruleError);
              // Если правило сломалось, отобразим хотя бы базовое одиночное событие
              expandedEvents.push({
                id: item.id,
                title: item.title,
                description: item.description,
                startDate: originalStart,
                endDate: originalEnd,
                isRecurring: item.isRecurring,
                rRule: item.rRule,
                creatorId: item.creatorId,
                isOwner: item.isOwner,
                isShared: item.isShared,
                participants: item.participants
              });
            }
          } else {
            // Обычное одиночное событие
            expandedEvents.push({
              id: item.id,
              title: item.title,
              description: item.description,
              startDate: originalStart,
              endDate: originalEnd,
              isRecurring: false,
              rRule: undefined,
              creatorId: item.creatorId,
              isOwner: item.isOwner,
              isShared: item.isShared,
              participants: item.participants
            });
          }
        });

        setEvents(expandedEvents);
      } else {
        console.error('Не удалось загрузить события, статус:', response.status);
      }
    } catch (error) {
      console.error('Ошибка сети:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEditModalOpen(true);  
  };

  const handleUpdateEvent = async (formData: { id: number; title: string; description: string | null }) => {
    try {
      const token = sessionStorage.getItem(AccessTokenKey);
      
      // Находим обновляемое событие в стейте, чтобы не потерять даты и RRule при отправке
      const current = events.find(e => e.id === formData.id);
      
      const updateDto = {
        id: formData.id,
        title: formData.title,
        description: formData.description,
        startDate: current ? current.startDate.toISOString() : new Date().toISOString(),
        endDate: current ? current.endDate.toISOString() : new Date().toISOString(),
        isRecurring: current ? current.isRecurring : false,
        rRule: current ? current.rRule : null,
        participantIds: null // Бэкенд перезапишет участников только если передать массив
      };

      const response = await fetch(BASE_URL_UPDATE_EVENT, {
        method: 'PUT', 
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateDto)
      });

      if (response.ok) {
        // Перезапрашиваем сетку, чтобы обновились все повторения этой серии
        fetchMyEvents();
        setIsEditModalOpen(false);
        setSelectedEvent(null);
      }
    } catch (error) {
      console.error('Ошибка при обновлении события:', error);
    }
  };  

  const handleDeleteEvent = async (eventId: number) => {
    try {
      const token = sessionStorage.getItem(AccessTokenKey);
      const response = await fetch(`${BASE_URL_DELETE_EVENT}/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Удаляем из стейта все события с этим ID (и одиночные, и всю серию повторений)
        setEvents((prev) => prev.filter((e) => e.id !== eventId));
        setIsEditModalOpen(false);
        setSelectedEvent(null);
      }
    } catch (error) {
      console.error('Ошибка при удалении события:', error);
    }
  };

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    setSelectedSlot({ start, end });
    setIsModalOpen(true);            
  };

  // МОДЕРНИЗИРОВАННАЯ ФУНКЦИЯ СОХРАНЕНИЯ КОМБИНИРОВАННОЙ ФОРМЫ
  const handleSaveEvent = async (formData: {
    personal?: { title: string; description: string | null; isRecurring: boolean; rRule: string | null };
    group?: { title: string; description: string | null; isRecurring: boolean; rRule: string | null; participantIds: number[] };
  }) => {
    if (!selectedSlot) return;

    try {
      const token = sessionStorage.getItem(AccessTokenKey);
      // 1. Формируем запрос для Личного события, если оно заполнено
      if (formData.personal) {
        const personalDto = {
          title: formData.personal.title,
          description: formData.personal.description,
          startDate: selectedSlot.start.toISOString(),
          endDate: selectedSlot.end.toISOString(),
          isRecurring: formData.personal.isRecurring, // ИСПРАВЛЕНО: берем значение из формы
          rRule: formData.personal.rRule,             // ИСПРАВЛЕНО: берем строку из формы
          participantIds: []
        };

        requests.push(
          fetch('https://localhost:7045/calendar/create', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(personalDto)
          }).then(res => {
            if (!res.ok) throw new Error('Не удалось сохранить личное событие');
            return res.json();
          })
        );
      }

      // 2. Формируем запрос для Совместной встречи, если она заполнена
      if (formData.group) {
        const groupDto = {
          title: formData.group.title,
          description: formData.group.description,
          startDate: selectedSlot.start.toISOString(),
          endDate: selectedSlot.end.toISOString(),
          isRecurring: formData.group.isRecurring,
          rRule: formData.group.rRule,
          participantIds: formData.group.participantIds
        };

        requests.push(
          fetch('https://localhost:7045/calendar/create', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(groupDto)
          }).then(res => {
            if (!res.ok) throw new Error('Не удалось сохранить совместную встречу');
            return res.json();
          })
        );
      }

      // Выполняем параллельную отправку на сервер
      await Promise.all(requests);

      // Полностью обновляем состояние календаря с сервера (сгенерирует повторения на лету)
      await fetchMyEvents();
      
      setIsModalOpen(false);
      setSelectedSlot(null);
    } catch (error) {
      console.error('Ошибка при сохранении события:', error);
      alert('Произошла ошибка при сохранении данных.');
    }
  };

const handleLogaut = () => {
  sessionStorage.removeItem(AccessTokenKey);
  sessionStorage.removeItem(RoleKey);
  sessionStorage.removeItem(UserNameKey);
  localStorage.removeItem(AccessTokenKey);
  localStorage.clear();
  navigate(RoutesPaths.Login);
  window.location.reload();
};

if (loading) return <div>Загрузка календаря...</div>;

const eventStyleGetter = (event: any) => {
  const backgroundColor = '#3369f3'
  const style = {
    backgroundColor: backgroundColor,
    borderRadius: '0px',
    opacity: 0.8,
    color: 'white',
    border: 'none',
    display: 'block'
  };
  return {
    style: style
  };
};

return (
  <div style={{ height: '80vh', padding: '20px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
      <div style={{ fontSize: '1.5em', fontWeight: 'bold', margin: 0, width: 'fit-content' }}>
        Календарь событий
      </div>
      
      <div style={{ fontSize: '1em', fontWeight: 'bold', margin: 0, width: 'fit-content', cursor: 'pointer' }} onClick={handleLogaut}>
        <div>{userLogin}</div>
        Выйти
      </div>
    </div>

    <Calendar
      localizer={localizer}
      events={events}
      startAccessor="startDate"
      endAccessor="endDate"
      culture="ru"
      messages={{
        next: "Вперед",
        previous: "Назад",
        today: "Сегодня",
        month: "Месяц",
        week: "Неделя",
        day: "День",
        agenda: "Повестка дня"
      }}
      eventPropGetter={eventStyleGetter}
      selectable={true}                
      onSelectSlot={handleSelectSlot}   
      onSelectEvent={handleSelectEvent} 
      style={{ height: '100%' }}
    />

    <EventModal 
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onSave={handleSaveEvent} // Подключена новая комбинированная функция
      selectedSlot={selectedSlot}
    />

    <EditEventModal 
      isOpen={isEditModalOpen}
      event={selectedEvent}
      onClose={() => { setIsEditModalOpen(false); setSelectedEvent(null); }}
      onUpdate={handleUpdateEvent}
      onDelete={handleDeleteEvent}
    />
  </div>
);
};

export default CalendarPage;
