export class LessonModal {
    constructor() {
        this.modal = document.getElementById("lesson-modal");
        this.closeButton = document.getElementsByClassName("close")[0];
        this.setupEventListeners();
    }

    open() {
        this.modal.style.display = "block";
    }

    close() {
        this.modal.style.display = "none";
    }

    setupEventListeners() {
        this.closeButton.onclick = () => this.close();
        
        document.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });
    }
} 