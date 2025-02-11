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

        // Загружаем сохраненную тему
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            this.themeSwitch.checked = true;
        }

        this.setupEventListeners();
        this.initializeTimeOptions();
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