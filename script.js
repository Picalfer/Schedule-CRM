import { Calendar } from './calendar.js';
import { LessonModal } from './modal.js';
import { SettingsManager } from './settings.js';

const calendar = new Calendar();
const modalManager = new LessonModal();
const settingsManager = new SettingsManager(calendar);

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    calendar.loadScheduleData('data.json');
    
    // Обработчики событий для кнопок навигации
    document.getElementById('prev-week').addEventListener('click', () => calendar.prevWeek());
    document.getElementById('next-week').addEventListener('click', () => calendar.nextWeek());
    document.getElementById('current-week').addEventListener('click', () => calendar.goToCurrentWeek());
    
    // Обработчик для кнопки настроек
    document.getElementById('settings-button').addEventListener('click', () => settingsManager.open());
});

// Глобальная функция для открытия модального окна урока
window.openLessonModal = (lessonData) => modalManager.open(lessonData);