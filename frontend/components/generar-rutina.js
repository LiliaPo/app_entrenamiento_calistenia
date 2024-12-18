class RutinaGenerator {
    constructor() {
        this.form = document.getElementById('rutina-form');
        this.resultadoDiv = document.getElementById('resultado');
        this.calendar = null;
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.initCalendar();
    }

    initCalendar() {
        const calendarElement = document.querySelector('.calendar');
        if (calendarElement) {
            this.calendar = new Calendar(calendarElement);
        }
    }

    async handleSubmit(e) {
        e.preventDefault();

        this.showLoading();

        const formData = {
            tipo: document.getElementById('tipo').value,
            lugar: document.getElementById('lugar').value,
            mensaje: document.getElementById('mensaje').value
        };

        try {
            const rutina = await this.generateRoutine(formData);
            this.displayRoutine(rutina, formData);
            if (this.calendar) {
                const trainingDays = this.extractTrainingDays(rutina.rutina);
                this.calendar.setTrainingDays(trainingDays);
            }
        } catch (error) {
            this.showError(error);
        }
    }

    showLoading() {
        this.resultadoDiv.innerHTML = '<div class="loading">Generando tu rutina personalizada</div>';
    }

    async generateRoutine(formData) {
        const response = await fetch('/generate-routine', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }

        const data = await response.json();
        if (data.error) {
            throw new Error(data.error);
        }

        return data;
    }

    displayRoutine(data, formData) {
        const rutinaFormateada = this.formatRoutine(data.rutina);
        
        this.resultadoDiv.innerHTML = `
            <div class="routine-header">
                <h2>Tu Rutina Personalizada</h2>
                <p class="routine-info">Tipo: ${formData.tipo} | Lugar: ${formData.lugar}</p>
            </div>
            <div class="routine-content">
                ${rutinaFormateada}
            </div>
        `;

        this.resultadoDiv.scrollIntoView({ behavior: 'smooth' });
    }

    formatRoutine(rutina) {
        return rutina.split('\n').map(line => {
            if (line.startsWith('Día')) {
                return `<h3 class="day-title">${line}</h3>`;
            } else if (line.startsWith('-')) {
                return `<div class="exercise-row">${line.substring(2)}</div>`;
            } else {
                return `<p class="routine-note">${line}</p>`;
            }
        }).join('');
    }

    showError(error) {
        console.error('Error:', error);
        this.resultadoDiv.innerHTML = `
            <div class="error-message">
                <p>Lo sentimos, hubo un error al generar la rutina.</p>
                <p class="error-details">${error.message}</p>
            </div>
        `;
    }

    extractTrainingDays(rutina) {
        const days = new Set();
        const today = new Date();
        const currentDay = today.getDate();
        const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
        
        const totalWorkoutDays = 6;
        let nextWorkoutDay = currentDay;

        for (let i = 0; i < totalWorkoutDays; i++) {
            if (nextWorkoutDay > daysInMonth) {
                nextWorkoutDay = 1;
            }
            days.add(nextWorkoutDay);
            nextWorkoutDay += 2;
        }

        return days;
    }
}

// Inicializar el generador de rutinas cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-message');
    
    // Obtener parámetros de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const tipo = urlParams.get('tipo');
    const lugar = urlParams.get('lugar');

    // Mensaje inicial del asistente
    function mostrarMensajeBienvenida() {
        const mensaje = `¡Hola! Veo que estás interesada en un entrenamiento de ${tipo.replace('-', ' ')} para hacer en ${lugar}. 
        
Para crear tu rutina personalizada, necesito saber algunos detalles:

1. ¿Cuál es tu nivel de experiencia? (principiante, intermedio, avanzado)
2. ¿Cuántos días a la semana puedes entrenar?
3. ¿Tienes alguna lesión o limitación que deba tener en cuenta?
4. ¿Tienes algún equipo disponible para entrenar? (si entrenas en casa)

Por favor, responde a estas preguntas y te ayudaré a crear la rutina perfecta para ti.`;

        agregarMensajeAsistente(mensaje);
    }

    // Función para agregar mensajes del asistente
    function agregarMensajeAsistente(texto) {
        const mensaje = document.createElement('div');
        mensaje.className = 'message assistant-message';
        mensaje.innerHTML = `
            <div class="message-text">${texto}</div>
            <div class="message-time">${new Date().toLocaleTimeString()}</div>
        `;
        chatMessages.appendChild(mensaje);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Función para agregar mensajes del usuario
    function agregarMensajeUsuario(texto) {
        const mensaje = document.createElement('div');
        mensaje.className = 'message user-message';
        mensaje.innerHTML = `
            <div class="message-text">${texto}</div>
            <div class="message-time">${new Date().toLocaleTimeString()}</div>
        `;
        chatMessages.appendChild(mensaje);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Función para procesar el mensaje del usuario y obtener respuesta
    async function procesarMensaje(mensaje) {
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    mensaje,
                    tipo,
                    lugar
                })
            });

            if (!response.ok) {
                throw new Error('Error en la comunicación con el servidor');
            }

            const data = await response.json();
            agregarMensajeAsistente(data.respuesta);

            // Si la respuesta incluye una rutina, actualizar el calendario
            if (data.rutina && window.calendar) {
                const diasEntrenamiento = extraerDiasEntrenamiento(data.rutina);
                window.calendar.setTrainingDays(diasEntrenamiento);
            }

        } catch (error) {
            console.error('Error:', error);
            agregarMensajeAsistente('Lo siento, ha ocurrido un error. Por favor, intenta de nuevo.');
        }
    }

    // Event listeners
    sendButton.addEventListener('click', () => {
        const mensaje = userInput.value.trim();
        if (mensaje) {
            agregarMensajeUsuario(mensaje);
            procesarMensaje(mensaje);
            userInput.value = '';
        }
    });

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendButton.click();
        }
    });

    // Mostrar mensaje de bienvenida al cargar la página
    mostrarMensajeBienvenida();

    new RutinaGenerator();
}); 