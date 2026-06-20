import React, { useState, useEffect } from 'react';
import {  AccessTokenKey } from '../../constants/commonConstants';


interface SelectedSlot {
  start: Date;
  end: Date;
}

interface AvailableUser {
  id: number;
  login: string;
}

// Обновленная структура данных для личного события с поддержкой RRule
interface PersonalEventData {
  title: string;
  description: string | null;
  isRecurring: boolean;
  rRule: string | null;
}

interface GroupEventData {
  title: string;
  description: string | null;
  isRecurring: boolean;
  rRule: string | null;
  participantIds: number[];
}

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { personal?: PersonalEventData; group?: GroupEventData }) => void;
  selectedSlot: SelectedSlot | null;
}

function EventModal({ isOpen, onClose, onSave, selectedSlot }: EventModalProps) {
  // --- Стейты для Блока 1: Личное событие ---
  const [personalTitle, setPersonalTitle] = useState<string>('');
  const [personalDesc, setPersonalDesc] = useState<string>('');
  const [isPersonalRecurring, setIsPersonalRecurring] = useState<boolean>(false);
  const [personalRecurrenceType, setPersonalRecurrenceType] = useState<string>('DAILY');

  // --- Стейты для Блока 2: Совместная встреча ---
  const [groupTitle, setGroupTitle] = useState<string>('');
  const [groupDesc, setGroupDesc] = useState<string>('');
  const [availableUsers, setAvailableUsers] = useState<AvailableUser[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<AvailableUser[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isGroupRecurring, setIsGroupRecurring] = useState<boolean>(false);
  const [groupRecurrenceType, setGroupRecurrenceType] = useState<string>('DAILY');

  // Загрузка пользователей для блока встречи
  useEffect(() => {
    const token = sessionStorage.getItem(AccessTokenKey);
    if (isOpen) {
      fetch('https://localhost:7045/calendar/available-users', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
        .then((res) => {
          if (!res.ok) throw new Error('Ошибка загрузки пользователей');
          return res.json();
        })
        .then((data: AvailableUser[]) => setAvailableUsers(data))
        .catch((err) => console.error('Ошибка при получении пользователей:', err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectUser = (user: AvailableUser) => {
    if (!selectedUsers.some((u) => u.id === user.id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
    setIsDropdownOpen(false);
  };

  const handleRemoveUser = (userId: number) => {
    setSelectedUsers(selectedUsers.filter((u) => u.id !== userId));
  };

  // Вспомогательная функция для генерации RRule
  const getRRuleString = (isRec: boolean, type: string): string | null => {
    if (!isRec) return null;
    switch (type) {
      case 'DAILY': return 'FREQ=DAILY';
      case 'WEEKLY': return 'FREQ=WEEKLY';
      case 'MONTHLY': return 'FREQ=MONTHLY';
      case '3MONTHS': return 'FREQ=MONTHLY;INTERVAL=3';
      default: return null;
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const hasPersonal = personalTitle.trim().length > 0;
    const hasGroup = groupTitle.trim().length > 0;

    if (!hasPersonal && !hasGroup) {
      alert('Заполни хотя бы одно название: для личного события или для встречи!');
      return;
    }

    const payload: { personal?: PersonalEventData; group?: GroupEventData } = {};

    if (hasPersonal) {
      payload.personal = {
        title: personalTitle.trim(),
        description: personalDesc.trim() || null,
        isRecurring: isPersonalRecurring,
        rRule: getRRuleString(isPersonalRecurring, personalRecurrenceType)
      };
    }

    if (hasGroup) {
      payload.group = {
        title: groupTitle.trim(),
        description: groupDesc.trim() || null,
        isRecurring: isGroupRecurring,
        rRule: getRRuleString(isGroupRecurring, groupRecurrenceType),
        participantIds: selectedUsers.map((u) => u.id)
      };
    }

    onSave(payload);
    handleReset();
  };

  const handleReset = () => {
    setPersonalTitle('');
    setPersonalDesc('');
    setIsPersonalRecurring(false);
    setPersonalRecurrenceType('DAILY');
    
    setGroupTitle('');
    setGroupDesc('');
    setSelectedUsers([]);
    setIsGroupRecurring(false);
    setGroupRecurrenceType('DAILY');
    
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
      justifyContent: 'center', alignItems: 'center', zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#fff', padding: '25px', borderRadius: '8px',
        width: '450px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', fontFamily: 'Arial, sans-serif',
        maxHeight: '85vh', overflowY: 'auto'
      }}>
        
        <form onSubmit={handleSubmit}>
          
          {/* === БЛОК 1: ЛИЧНОЕ СОБЫТИЕ === */}
          <div style={{ borderBottom: '2px dashed #e2e8f0', paddingBottom: '15px', marginBottom: '15px' }}>
            <div style={{ fontSize: '1.1em', fontWeight: 'bold', marginBottom: '10px', color: '#2d3748' }}>
              Личное событие
            </div>
            
            <div style={{ marginBottom: '10px' }}>
              <input 
                type="text" 
                value={personalTitle}
                onChange={(e) => setPersonalTitle(e.target.value)}
                placeholder="Название личного события..."
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <textarea 
                value={personalDesc}
                onChange={(e) => setPersonalDesc(e.target.value)}
                placeholder="Описание личного события..."
                rows={2}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', resize: 'vertical' }}
              />
            </div>

            {/* Чекбокс повторений для ЛИЧНОГО события */}
            <div style={{ backgroundColor: '#f7fafc', border: '1px solid #e2e8f0', padding: '8px', borderRadius: '6px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85em' }}>
                <input type="checkbox" checked={isPersonalRecurring} onChange={(e) => setIsPersonalRecurring(e.target.checked)} />
                Повторять личное событие
              </label>

              {isPersonalRecurring && (
                <div style={{ marginTop: '6px' }}>
                  <select value={personalRecurrenceType} onChange={(e) => setPersonalRecurrenceType(e.target.value)} style={{ width: '100%', padding: '4px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#fff', fontSize: '0.85em' }}>
                    <option value="DAILY">Повторять каждый день</option>
                    <option value="WEEKLY">Повторять каждую неделю</option>
                    <option value="MONTHLY">Повторять каждый месяц</option>
                    <option value="3MONTHS">Повторять каждые три месяца</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* === БЛОК 2: СОВМЕСТНАЯ ВСТРЕЧА === */}
          <div style={{ marginBottom: '15px' }}>
            <div style={{ fontSize: '1.1em', fontWeight: 'bold', marginBottom: '10px', color: '#2d3748' }}>
              Совместная встреча
            </div>
            
            <div style={{ marginBottom: '10px' }}>
              <input 
                type="text" 
                value={groupTitle}
                onChange={(e) => setGroupTitle(e.target.value)}
                placeholder="Название совместной встречи..."
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '10px' }}>
              <textarea 
                value={groupDesc}
                onChange={(e) => setGroupDesc(e.target.value)}
                placeholder="Описание встречи..."
                rows={2}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', resize: 'vertical' }}
              />
            </div>

            {/* Выбор коллег */}
            <div style={{ marginBottom: '10px', position: 'relative' }}>
              <div 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                style={{ 
                  minHeight: '38px', padding: '5px 10px', borderRadius: '4px', border: '1px solid #ccc', 
                  backgroundColor: '#fff', display: 'flex', flexWrap: 'wrap', gap: '5px', alignItems: 'center', cursor: 'pointer' 
                }}
              >
                {selectedUsers.length === 0 && <span style={{ color: '#aaa', fontSize: '0.9em' }}>Пригласить участников...</span>}
                {selectedUsers.map((user) => (
                  <span 
                    key={user.id} 
                    style={{ backgroundColor: '#e2e8f0', color: '#334155', padding: '2px 8px', borderRadius: '4px', fontSize: '0.85em', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {user.login}
                    <button type="button" onClick={() => handleRemoveUser(user.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold', color: '#94a3b8', padding: 0 }}>×</button>
                  </span>
                ))}
              </div>

              {isDropdownOpen && (
                <div style={{ position: 'absolute', top: '100%', left: 0, width: '100%', backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '4px', zIndex: 1010, maxHeight: '120px', overflowY: 'auto' }}>
                  {availableUsers.filter(au => !selectedUsers.some(su => su.id === au.id)).length === 0 ? (
                    <div style={{ padding: '8px', color: '#888', fontSize: '0.9em', textAlign: 'center' }}>Нет доступных пользователей</div>
                  ) : (
                    availableUsers
                      .filter((au) => !selectedUsers.some((su) => su.id === au.id))
                      .map((user) => (
                        <div key={user.id} onClick={() => handleSelectUser(user)} style={{ padding: '8px 12px', cursor: 'pointer', fontSize: '0.9em' }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}>
                          {user.login}
                        </div>
                      ))
                  )}
                </div>
              )}
            </div>

            {/* Чекбокс повторений для СОВМЕСТНОЙ встречи */}
            <div style={{ backgroundColor: '#fdfdfd', border: '1px solid #edf2f7', padding: '10px', borderRadius: '6px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9em' }}>
                <input type="checkbox" checked={isGroupRecurring} onChange={(e) => setIsGroupRecurring(e.target.checked)} />
                Сделать встречу повторяющейся
              </label>

              {isGroupRecurring && (
                <div style={{ marginTop: '8px' }}>
                  <select value={groupRecurrenceType} onChange={(e) => setGroupRecurrenceType(e.target.value)} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#fff', fontSize: '0.9em' }}>
                    <option value="DAILY">Повторять каждый день</option>
                    <option value="WEEKLY">Повторять каждую неделю</option>
                    <option value="MONTHLY">Повторять каждый месяц</option>
                    <option value="3MONTHS">Повторять каждые три месяца</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Таймслот */}
          <div style={{ fontSize: '0.85em', color: '#666', marginBottom: '20px', backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '4px' }}>
            <strong>Выбранное время:</strong> {selectedSlot?.start.toLocaleString('ru-RU')} — {selectedSlot?.end.toLocaleString('ru-RU')}
          </div>

          {/* Кнопки управления */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" onClick={handleReset} style={{ padding: '8px 16px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#fff', cursor: 'pointer' }}>
              Отмена
            </button>
            <button type="submit" style={{ padding: '8px 16px', borderRadius: '3px', border: 'none', backgroundColor: '#3369f3', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EventModal;
