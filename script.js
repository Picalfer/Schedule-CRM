const lessonModal = document.getElementById("lesson-modal");
const closeButton = document.getElementsByClassName("close")[0];

function openLessonModal() {

    lessonModal.style.display = "block";
}

function closeCourseModal() {
    lessonModal.style.display = "none";
}

closeButton.onclick = function () {
    closeCourseModal()
}

document.addEventListener('click', function (e) {
    if (e.target === lessonModal) {
        closeCourseModal();
    }
});

let currentWeekOffset = 0;

// Структура данных для хранения регулярных открытых окошек
const weeklyOpenSlots = {
    monday: ['08:00', '09:00', '10:00'], // Пример: каждый понедельник с 8 до 11
    tuesday: ['08:00'],
    wednesday: ['08:00'],
    thursday: ['08:00'],
    friday: ['08:00', '09:00', '10:00'],
    saturday: ['17:00'],
    sunday: []
};

// Структура данных для хранения уроков
const lessons = [
    {
        id: 1,
        date: '2025-02-10',
        time: '08:00',
        student: 'Андрей(Марина)',
        subject: 'Roblox Studio',
        status: 'permanent'
    },
    {
        id: 2,
        date: '2025-02-10',
        time: '09:00',
        student: 'Иван(Марина)',
        subject: 'Python',
        status: 'one-time'
    },
    {
        id: 3,
        date: '2025-02-14',
        time: '08:00',
        student: 'Мария(Марина)',
        subject: 'Scratch',
        status: 'permanent'
    }
];

// Хранилище для отображаемых уроков
let displayedLessons = new Set();

function clearSchedule() {
    document.querySelectorAll('.week-day .hour').forEach(hour => {
        if (!hour.querySelector('.lesson')) { // Очищаем только если нет урока
            hour.className = 'hour';
            hour.innerHTML = '';
        }
    });
}

function getDateString(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

// Общая функция для создания HTML урока
function createLessonHTML(lesson) {
    const emoji = lesson.status === 'permanent' ? '🔄' : '1️⃣';
    const statusText = lesson.status === 'permanent' ? 'Постоянный урок' : 'Разовый урок';
    
    return `
        <div class="lesson ${lesson.status}" data-lesson-id="${lesson.id}" onclick="openLessonModal()">
            <h4 data-emoji="${emoji}">${statusText}</h4>
            <p>Ученик: ${lesson.student}</p>
            <p>Предмет: ${lesson.subject}</p>
        </div>
    `;
}

function updateScheduleDisplay() {
    clearSchedule();
    displayedLessons.clear(); // Очищаем список отображаемых уроков
    
    const dates = [];
    const today = new Date();
    const currentDay = today.getDay();
    const diff = currentDay === 0 ? 6 : currentDay - 1;
    
    const monday = new Date(today);
    monday.setDate(today.getDate() - diff + (currentWeekOffset * 7));
    monday.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 7; i++) {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);
        dates.push(date);
    }
    
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
    // Сначала отмечаем все открытые окошки
    days.forEach((day, dayIndex) => {
        const dayElement = document.getElementById(day);
        if (!dayElement) return;
        
        const slots = weeklyOpenSlots[day];
        slots.forEach(time => {
            const hour = parseInt(time.split(':')[0]);
            const hourIndex = hour - 6;
            const hourElement = dayElement.children[hourIndex];
            if (hourElement) {
                hourElement.classList.add('open-window');
            }
        });
    });
    
    // Затем добавляем уроки
    lessons.forEach(lesson => {
        const lessonDate = new Date(lesson.date + 'T00:00:00');
        
        if (lesson.status === 'permanent') {
            const lessonDay = lessonDate.getDay();
            const dayIndex = lessonDay === 0 ? 6 : lessonDay - 1;
            const dayElement = document.getElementById(days[dayIndex]);
            
            if (dayElement) {
                const hour = parseInt(lesson.time.split(':')[0]);
                const hourIndex = hour - 6;
                const hourElement = dayElement.children[hourIndex];
                
                if (hourElement) {
                    const wasOpen = hourElement.classList.contains('open-window');
                    hourElement.innerHTML = createLessonHTML(lesson);
                    if (wasOpen) {
                        hourElement.classList.add('open-window');
                    }
                    displayedLessons.add(lesson.id);
                }
            }
        } else {
            // Проверяем, входит ли дата в текущую неделю
            const isInCurrentWeek = dates.some(date => 
                date.getFullYear() === lessonDate.getFullYear() &&
                date.getMonth() === lessonDate.getMonth() &&
                date.getDate() === lessonDate.getDate()
            );
            
            if (isInCurrentWeek) {
                const dayIndex = lessonDate.getDay();
                const adjustedDayIndex = dayIndex === 0 ? 6 : dayIndex - 1;
                const dayElement = document.getElementById(days[adjustedDayIndex]);
                
                if (dayElement) {
                    const hour = parseInt(lesson.time.split(':')[0]);
                    const hourIndex = hour - 6;
                    const hourElement = dayElement.children[hourIndex];
                    
                    if (hourElement) {
                        const wasOpen = hourElement.classList.contains('open-window');
                        hourElement.innerHTML = createLessonHTML(lesson);
                        if (wasOpen) {
                            hourElement.classList.add('open-window');
                        }
                        displayedLessons.add(lesson.id);
                    }
                }
            }
        }
    });
    
    // Удаляем уроки, которые не должны отображаться
    document.querySelectorAll('.lesson').forEach(lessonElement => {
        const lessonId = parseInt(lessonElement.dataset.lessonId);
        if (!displayedLessons.has(lessonId)) {
            lessonElement.parentElement.innerHTML = '';
            lessonElement.parentElement.className = 'hour';
        }
    });
}

function updateCalendar() {
    updateHeaderDates();
    updateWeekInfo();
}

function getWeekDates(offset = 0) {
    const today = new Date();
    const currentDay = today.getDay();
    const diff = currentDay === 0 ? 6 : currentDay - 1;
    
    const monday = new Date(today);
    monday.setDate(today.getDate() - diff + (offset * 7));
    
    const dates = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);
        dates.push(date.getDate());
    }
    
    return dates;
}

function updateHeaderDates() {
    const dates = getWeekDates(currentWeekOffset);
    const dateElements = document.querySelectorAll('.date');
    const dayHeaders = document.querySelectorAll('.day-header');
    
    // Получаем текущую дату
    const today = new Date();
    const currentDate = today.getDate();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    dateElements.forEach((element, index) => {
        element.textContent = dates[index];
        
        // Проверяем, является ли этот день сегодняшним
        const displayedDate = new Date(today);
        displayedDate.setDate(today.getDate() - (today.getDay() === 0 ? 6 : today.getDay() - 1) + index + (currentWeekOffset * 7));
        
        if (displayedDate.getDate() === currentDate && 
            displayedDate.getMonth() === currentMonth && 
            displayedDate.getFullYear() === currentYear) {
            dayHeaders[index].classList.add('current-day');
        } else {
            dayHeaders[index].classList.remove('current-day');
        }
    });
}

function formatDate(date) {
    const months = [
        'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
        'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
    ];
    
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function updateWeekInfo() {
    const today = new Date();
    const currentDay = today.getDay();
    const diff = currentDay === 0 ? 6 : currentDay - 1;
    
    const monday = new Date(today);
    monday.setDate(today.getDate() - diff + (currentWeekOffset * 7));
    
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    
    const weekRangeElement = document.getElementById('week-range');
    weekRangeElement.textContent = `${formatDate(monday)} - ${formatDate(sunday)}`;
}

// Обновляем вызов при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    updateCalendar();
    updateScheduleDisplay();
});

// Обработчики событий для кнопок навигации
document.getElementById('prev-week').addEventListener('click', () => {
    currentWeekOffset--;
    updateCalendar();
    updateScheduleDisplay();
});

document.getElementById('next-week').addEventListener('click', () => {
    currentWeekOffset++;
    updateCalendar();
    updateScheduleDisplay();
});

document.getElementById('current-week').addEventListener('click', () => {
    currentWeekOffset = 0;
    updateCalendar();
    updateScheduleDisplay();
});