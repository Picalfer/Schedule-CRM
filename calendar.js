export class Calendar {
    constructor() {
        this.currentWeekOffset = 0;
        this.scheduleData = null;
        this.displayedLessons = new Set();
    }

    getWeekDates(offset = 0) {
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

    formatDate(date) {
        const months = [
            'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
            'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
        ];
        
        return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    }

    updateHeaderDates() {
        const dates = this.getWeekDates(this.currentWeekOffset);
        const dateElements = document.querySelectorAll('.date');
        const dayHeaders = document.querySelectorAll('.day-header');
        
        const today = new Date();
        const currentDate = today.getDate();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        
        dateElements.forEach((element, index) => {
            element.textContent = dates[index];
            
            const displayedDate = new Date(today);
            displayedDate.setDate(today.getDate() - (today.getDay() === 0 ? 6 : today.getDay() - 1) + index + (this.currentWeekOffset * 7));
            
            if (displayedDate.getDate() === currentDate && 
                displayedDate.getMonth() === currentMonth && 
                displayedDate.getFullYear() === currentYear) {
                dayHeaders[index].classList.add('current-day');
            } else {
                dayHeaders[index].classList.remove('current-day');
            }
        });
    }

    updateWeekInfo() {
        const today = new Date();
        const currentDay = today.getDay();
        const diff = currentDay === 0 ? 6 : currentDay - 1;
        
        const monday = new Date(today);
        monday.setDate(today.getDate() - diff + (this.currentWeekOffset * 7));
        
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        
        const weekRangeElement = document.getElementById('week-range');
        weekRangeElement.textContent = `${this.formatDate(monday)} - ${this.formatDate(sunday)}`;
    }

    clearSchedule() {
        document.querySelectorAll('.week-day .hour').forEach(hour => {
            if (!hour.querySelector('.lesson')) {
                hour.className = 'hour';
                hour.innerHTML = '';
            }
        });
    }

    createLessonHTML(lesson) {
        const emoji = lesson.status === 'permanent' ? '🔄' : '1️⃣';
        const statusText = lesson.status === 'permanent' ? 'Постоянный урок' : 'Разовый урок';
        
        return `
            <div class="lesson ${lesson.status}" 
                 data-lesson-id="${lesson.id}" 
                 onclick="window.openLessonModal(${JSON.stringify(lesson).replace(/"/g, '&quot;')})">
                <h4 data-emoji="${emoji}">${statusText}</h4>
                <p>Ученик: ${lesson.student}</p>
                <p>Предмет: ${lesson.subject}</p>
            </div>
        `;
    }

    updateScheduleDisplay() {
        if (!this.scheduleData) return;
        
        this.clearSchedule();
        this.displayedLessons.clear();
        
        const dates = [];
        const today = new Date();
        const currentDay = today.getDay();
        const diff = currentDay === 0 ? 6 : currentDay - 1;
        
        const monday = new Date(today);
        monday.setDate(today.getDate() - diff + (this.currentWeekOffset * 7));
        monday.setHours(0, 0, 0, 0);
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(monday);
            date.setDate(monday.getDate() + i);
            dates.push(date);
        }
        
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        
        // Отмечаем открытые окошки
        days.forEach((day, dayIndex) => {
            const dayElement = document.getElementById(day);
            if (!dayElement) return;
            
            const slots = this.scheduleData.weeklyOpenSlots[day];
            slots.forEach(time => {
                const hour = parseInt(time.split(':')[0]);
                const hourIndex = hour - 6;
                const hourElement = dayElement.children[hourIndex];
                if (hourElement) {
                    hourElement.classList.add('open-window');
                }
            });
        });
        
        // Добавляем уроки
        this.scheduleData.lessons.forEach(lesson => {
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
                        hourElement.innerHTML = this.createLessonHTML(lesson);
                        if (wasOpen) {
                            hourElement.classList.add('open-window');
                        }
                        this.displayedLessons.add(lesson.id);
                    }
                }
            } else {
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
                            hourElement.innerHTML = this.createLessonHTML(lesson);
                            if (wasOpen) {
                                hourElement.classList.add('open-window');
                            }
                            this.displayedLessons.add(lesson.id);
                        }
                    }
                }
            }
        });
        
        // Удаляем уроки, которые не должны отображаться
        document.querySelectorAll('.lesson').forEach(lessonElement => {
            const lessonId = lessonElement.dataset.lessonId;
            if (!this.displayedLessons.has(lessonId)) {
                const hourElement = lessonElement.closest('.hour');
                if (hourElement) {
                    const lesson = this.scheduleData.lessons.find(l => l.id === lessonId);
                    const time = lesson?.time;
                    const dayElement = hourElement.closest('.week-day');
                    const day = dayElement?.id;
                    
                    hourElement.innerHTML = '';
                    hourElement.className = 'hour';
                    
                    if (day && this.scheduleData.weeklyOpenSlots[day].includes(time)) {
                        hourElement.classList.add('open-window');
                    }
                }
            }
        });
    }

    // Навигация
    nextWeek() {
        this.currentWeekOffset++;
        this.updateCalendar();
        this.updateScheduleDisplay();
    }

    prevWeek() {
        this.currentWeekOffset--;
        this.updateCalendar();
        this.updateScheduleDisplay();
    }

    goToCurrentWeek() {
        this.currentWeekOffset = 0;
        this.updateCalendar();
        this.updateScheduleDisplay();
    }

    updateCalendar() {
        this.updateHeaderDates();
        this.updateWeekInfo();
    }

    // Загрузка данных
    async loadScheduleData(url) {
        try {
            const response = await fetch(url);
            this.scheduleData = await response.json();
            
            document.querySelector('.teacher-name').textContent = 
                `${this.scheduleData.teacher.firstName} ${this.scheduleData.teacher.lastName}`;
            
            this.updateCalendar();
            this.updateScheduleDisplay();
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
        }
    }
} 