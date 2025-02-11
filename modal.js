export class LessonModal {
    constructor() {
        this.modal = document.getElementById("lesson-modal");
        this.closeButton = document.getElementsByClassName("close")[0];
        this.form = document.getElementById("lesson-form");
        this.cancelButton = this.modal.querySelector(".cancel-button");
        this.submitButton = this.modal.querySelector(".submit-button");
        this.topicInput = document.getElementById("lesson-topic");
        
        this.setupEventListeners();
    }

    open(lessonData) {
        // Форматируем сегодняшнюю дату
        const today = new Date();
        const formattedDate = today.toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Заполняем форму данными урока
        document.getElementById("lesson-date").value = formattedDate;
        document.getElementById("lesson-course").value = lessonData.subject;
        
        // Очищаем поля ввода
        document.getElementById("lesson-topic").value = "";
        document.getElementById("lesson-homework").value = "";
        document.getElementById("lesson-comment").value = "";
        
        // Добавляем информацию об уроке
        const emoji = lessonData.status === 'permanent' ? '🔄' : '1️⃣';
        const statusText = lessonData.status === 'permanent' ? 'Постоянный урок' : 'Разовый урок';
        this.modal.querySelector('.lesson-type').innerHTML = `${emoji} ${statusText}`;
        this.modal.querySelector('.lesson-student').textContent = `Ученик: ${lessonData.student}`;
        
        this.modal.style.display = "block";
    }

    close() {
        this.modal.style.display = "none";
        this.form.reset();
        // Убираем ошибки при закрытии
        this.topicInput.closest('.form-group').classList.remove('error');
    }

    validateForm() {
        let isValid = true;
        const topicGroup = this.topicInput.closest('.form-group');
        
        if (!this.topicInput.value.trim()) {
            topicGroup.classList.add('error');
            isValid = false;
        } else {
            topicGroup.classList.remove('error');
        }
        
        return isValid;
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
            if (this.validateForm()) {
                // Здесь будет логика сохранения данных
                this.close();
            }
        };

        // Убираем ошибку при вводе
        this.topicInput.addEventListener('input', () => {
            const topicGroup = this.topicInput.closest('.form-group');
            if (this.topicInput.value.trim()) {
                topicGroup.classList.remove('error');
            }
        });
    }
} 