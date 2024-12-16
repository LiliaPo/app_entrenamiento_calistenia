document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-message');
    
    const urlParams = new URLSearchParams(window.location.search);
    const tipo = urlParams.get('tipo');
    const lugar = urlParams.get('lugar');

    // Mensaje inicial del asistente
    const mensajesIniciales = {
        'perdida-peso': '¡Hola! Para ayudarte a crear una <strong>rutina de pérdida de peso</strong> para realizar',
        'cuerpo-esculpido': '¡Hola! Para ayudarte a crear una <strong>rutina de tonificación</strong> para realizar',
        'gluteos': '¡Hola! Para ayudarte a crear una <strong>rutina específica para glúteos</strong> para realizar',
        'abdominales': '¡Hola! Para ayudarte a crear una <strong>rutina de abdominales</strong> para realizar',
        'aumento-muscular': '¡Hola! Para ayudarte a crear una <strong>rutina de ganancia muscular</strong> para realizar',
        'pesas': '¡Hola! Para ayudarte a crear una <strong>rutina de pesas</strong> para realizar',
        'crossfit': '¡Hola! Para ayudarte a crear una <strong>rutina de CrossFit</strong> para realizar',
        'completo': '¡Hola! Para ayudarte a crear una <strong>rutina de cuerpo completo</strong> para realizar',
        'posparto': '¡Hola! Para ayudarte a crear una <strong>rutina de recuperación posparto</strong> para realizar'
    };

    addMessage('assistant', `${mensajesIniciales[tipo] || '¡Hola! Para ayudarte a crear una rutina para realizar'} <strong>en ${lugar}</strong>, necesito conocer algunos detalles:

1. ¿Cuál es tu edad, género y nivel de actividad física actual?

2. ¿Tienes alguna lesión o condición médica que deba considerar?

3. ¿Cuánto tiempo puedes dedicar a entrenar cada semana?

4. ¿Hay algún tipo de ejercicio que prefieras o que desees evitar?

Por favor, responde estas preguntas y te ayudaré a crear una rutina personalizada.`);

    // Función para añadir mensajes al chat
    function addMessage(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const messageText = document.createElement('div');
        messageText.className = 'message-text';
        messageText.innerHTML = text;
        
        const messageTime = document.createElement('div');
        messageTime.className = 'message-time';
        messageTime.textContent = new Date().toLocaleTimeString();
        
        messageDiv.appendChild(messageText);
        messageDiv.appendChild(messageTime);
        chatMessages.appendChild(messageDiv);
        
        // Scroll al último mensaje
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Manejar el envío de mensajes
    async function handleSendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        // Añadir mensaje del usuario al chat
        addMessage('user', message);
        userInput.value = '';

        try {
            const response = await fetch('/generate-routine', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    tipo,
                    lugar,
                    mensaje: message
                }),
            });

            if (!response.ok) {
                throw new Error('Error al generar la respuesta');
            }

            const data = await response.json();
            addMessage('assistant', data.rutina);

            // Extraer los días de entrenamiento de la rutina
            const trainingDays = extractTrainingDays(data.rutina);
            calendar.setTrainingDays(trainingDays);

        } catch (error) {
            console.error('Error:', error);
            addMessage('assistant', 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.');
        }
    }

    // Event listeners
    sendButton.addEventListener('click', handleSendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    });

    const calendar = new Calendar(document.getElementById('calendar'));

    function extractTrainingDays(rutina) {
        const days = new Set();
        const dayMatches = rutina.match(/Día \d+/g);
        if (dayMatches) {
            dayMatches.forEach(match => {
                const day = parseInt(match.replace('Día ', ''));
                if (!isNaN(day)) {
                    days.add(day);
                }
            });
        }
        return days;
    }
}); 