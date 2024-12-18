class Calendar {
    constructor(container) {
        if (!container) {
            console.error('No se encontró el contenedor del calendario');
            return;
        }
        this.container = container;
        this.date = new Date();
        this.trainingDays = new Set();
        this.render();
        console.log('Calendario inicializado');
    }

    render() {
        const month = this.date.getMonth();
        const year = this.date.getFullYear();
        
        // Actualizar el mes en el header existente
        const monthDisplay = this.container.parentElement.querySelector('.calendar-month');
        if (monthDisplay) {
            monthDisplay.textContent = new Date(year, month).toLocaleString('es', { month: 'long', year: 'numeric' });
        }
        
        // Generar los días
        const daysContainer = this.container;
        daysContainer.innerHTML = `
            <div class="weekdays">
                <div class="weekday">Dom</div>
                <div class="weekday">Lun</div>
                <div class="weekday">Mar</div>
                <div class="weekday">Mié</div>
                <div class="weekday">Jue</div>
                <div class="weekday">Vie</div>
                <div class="weekday">Sáb</div>
            </div>
            <div class="days">
                ${this.generateDays()}
            </div>
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
        // Buscar los botones en el contenedor padre
        const prevButton = this.container.parentElement.querySelector('.prev-month');
        const nextButton = this.container.parentElement.querySelector('.next-month');
        
        if (prevButton && nextButton) {
            // Remover listeners anteriores si existen
            prevButton.replaceWith(prevButton.cloneNode(true));
            nextButton.replaceWith(nextButton.cloneNode(true));
            
            // Obtener las nuevas referencias después del reemplazo
            const newPrevButton = this.container.parentElement.querySelector('.prev-month');
            const newNextButton = this.container.parentElement.querySelector('.next-month');
            
            // Agregar nuevos listeners
            newPrevButton.addEventListener('click', () => {
                this.date.setMonth(this.date.getMonth() - 1);
                this.render();
            });
            
            newNextButton.addEventListener('click', () => {
                this.date.setMonth(this.date.getMonth() + 1);
                this.render();
            });
        }
    }

    setTrainingDays(days) {
        console.log('Estableciendo días de entrenamiento:', days);
        this.trainingDays = new Set(days);
        this.render();
    }
}

// Inicializar el calendario cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM cargado, buscando contenedor del calendario');
    const calendarContainer = document.querySelector('.calendar');
    if (calendarContainer) {
        console.log('Contenedor del calendario encontrado');
        window.calendar = new Calendar(calendarContainer);
    } else {
        console.error('No se encontró el contenedor del calendario');
    }
}); 