class Calendar {
    constructor(container) {
        this.container = container;
        this.date = new Date();
        this.trainingDays = new Set();
        this.render();
    }

    render() {
        const month = this.date.getMonth();
        const year = this.date.getFullYear();
        
        this.container.innerHTML = `
            <div class="calendar-header">
                <div class="calendar-nav">
                    <button class="prev-month">&lt;</button>
                    <span class="calendar-month">${new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                    <button class="next-month">&gt;</button>
                </div>
            </div>
            <div class="weekday">Dom</div>
            <div class="weekday">Lun</div>
            <div class="weekday">Mar</div>
            <div class="weekday">Mié</div>
            <div class="weekday">Jue</div>
            <div class="weekday">Vie</div>
            <div class="weekday">Sáb</div>
            ${this.generateDays()}
        `;

        this.addEventListeners();
    }

    generateDays() {
        const month = this.date.getMonth();
        const year = this.date.getFullYear();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startingDay = firstDay.getDay();
        const totalDays = lastDay.getDate();
        
        let days = '';
        
        // Días del mes anterior
        const prevMonth = new Date(year, month, 0);
        const prevMonthDays = prevMonth.getDate();
        for (let i = startingDay - 1; i >= 0; i--) {
            days += `<div class="calendar-day other-month">${prevMonthDays - i}</div>`;
        }
        
        // Días del mes actual
        const today = new Date();
        for (let i = 1; i <= totalDays; i++) {
            const isToday = today.getDate() === i && 
                           today.getMonth() === month && 
                           today.getFullYear() === year;
            const isTrainingDay = this.trainingDays.has(i);
            
            days += `<div class="calendar-day${isToday ? ' today' : ''}${isTrainingDay ? ' training-day' : ''}">${i}</div>`;
        }
        
        // Días del mes siguiente
        const remainingDays = 42 - (startingDay + totalDays);
        for (let i = 1; i <= remainingDays; i++) {
            days += `<div class="calendar-day other-month">${i}</div>`;
        }
        
        return days;
    }

    addEventListeners() {
        const prevButton = this.container.querySelector('.prev-month');
        const nextButton = this.container.querySelector('.next-month');
        
        prevButton.addEventListener('click', () => {
            this.date.setMonth(this.date.getMonth() - 1);
            this.render();
        });
        
        nextButton.addEventListener('click', () => {
            this.date.setMonth(this.date.getMonth() + 1);
            this.render();
        });
    }

    setTrainingDays(days) {
        this.trainingDays = new Set(days);
        this.render();
    }
} 