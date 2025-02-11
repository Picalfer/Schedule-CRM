export class SettingsManager {
    constructor(calendar) {
        this.calendar = calendar;
        this.modal = document.getElementById('settings-modal');
        this.startHourSelect = document.getElementById('start-hour');
        this.endHourSelect = document.getElementById('end-hour');
        this.closeButton = this.modal.querySelector('.close');
        this.cancelButton = this.modal.querySelector('.cancel-button');
        this.submitButton = this.modal.querySelector('.submit-button');
        this.themeSwitch = document.getElementById('theme-switch');

        // Загружаем сохраненные настройки
        this.loadSavedSettings();
        
        this.setupEventListeners();
        this.initializeTimeOptions();
    }

    loadSavedSettings() {
        // Загружаем тему
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            this.themeSwitch.checked = true;
        }

        // Загружаем сохраненные часы
        const savedStartHour = localStorage.getItem('startHour');
        const savedEndHour = localStorage.getItem('endHour');
        
        if (savedStartHour && savedEndHour) {
            const startHour = parseInt(savedStartHour);
            const endHour = parseInt(savedEndHour);
            
            // Проверяем валидность сохраненных значений
            if (startHour < endHour && startHour >= 0 && endHour <= 23) {
                this.calendar.updateWorkingHours(startHour, endHour);
            }
        }
    }

    initializeTimeOptions() {
        // Добавляем опции с 0 до 23 часов
        for (let i = 0; i <= 23; i++) {
            const hour = String(i).padStart(2, '0');
            const startOption = new Option(`${hour}:00`, i);
            const endOption = new Option(`${hour}:00`, i);

            this.startHourSelect.add(startOption);
            this.endHourSelect.add(endOption);
        }
    }

    open() {
        // Устанавливаем текущие значения
        this.startHourSelect.value = this.calendar.startHour;
        this.endHourSelect.value = this.calendar.endHour;
        this.modal.style.display = 'block';
    }

    close() {
        this.modal.style.display = 'none';
    }

    setupEventListeners() {
        this.closeButton.onclick = () => this.close();
        this.cancelButton.onclick = () => this.close();

        document.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });

        this.submitButton.onclick = (e) => {
            e.preventDefault();
            const startHour = parseInt(this.startHourSelect.value);
            const endHour = parseInt(this.endHourSelect.value);

            if (startHour < endHour) {
                // Сохраняем настройки в localStorage
                localStorage.setItem('startHour', startHour);
                localStorage.setItem('endHour', endHour);
                
                this.calendar.updateWorkingHours(startHour, endHour);
                this.close();
            } else {
                alert('Время начала должно быть меньше времени окончания');
            }
        };

        this.themeSwitch.addEventListener('change', () => {
            if (this.themeSwitch.checked) {
                document.body.classList.add('dark-theme');
                localStorage.setItem('theme', 'dark');
            } else {
                document.body.classList.remove('dark-theme');
                localStorage.setItem('theme', 'light');
            }
        });
    }
} 