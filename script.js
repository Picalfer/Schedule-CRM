import { Calendar } from './calendar.js';
import { LessonModal } from './modal.js';

const calendar = new Calendar();
const modalManager = new LessonModal();

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    calendar.loadScheduleData('data.json');
    
    // Обработчики событий для кнопок навигации
    document.getElementById('prev-week').addEventListener('click', () => calendar.prevWeek());
    document.getElementById('next-week').addEventListener('click', () => calendar.nextWeek());
    document.getElementById('current-week').addEventListener('click', () => calendar.goToCurrentWeek());
});

// Глобальная функция для открытия модального окна (используется в HTML)
window.openLessonModal = (lessonData) => modalManager.open(lessonData);