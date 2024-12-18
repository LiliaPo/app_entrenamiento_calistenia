document.addEventListener('DOMContentLoaded', () => {
    const generarRutinaBtn = document.getElementById('generar-rutina');
    if (generarRutinaBtn) {
        const rutinaResultado = document.getElementById('rutina-resultado');
        const calendar = new Calendar(document.getElementById('calendar'));

        generarRutinaBtn.addEventListener('click', async () => {
            const objetivo = document.getElementById('objetivo').value;
            const nivel = document.getElementById('nivel').value;

            // Mostrar indicador de carga
            rutinaResultado.innerHTML = '<div class="loading">Generando tu rutina personalizada...</div>';
            generarRutinaBtn.disabled = true;

            try {
                const response = await fetch('/generate-routine', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        tipo: objetivo,
                        lugar: 'gimnasio',
                        mensaje: `Necesito una rutina de entrenamiento detallada para un usuario de nivel ${nivel} con objetivo de ${objetivo}. 
                                La rutina debe ser de 6 días a la semana, con ejercicios específicos, series, repeticiones y descansos.
                                Por favor, incluye pesos recomendados y notas sobre la técnica correcta.`
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.detalles || 'Error al generar la rutina');
                }

                const data = await response.json();

                // Formatear la rutina para mejor legibilidad
                const rutinaFormateada = data.rutina
                    .split('\n')
                    .map(line => {
                        if (line.startsWith('Día')) {
                            return `<h3 class="day-title">${line}</h3>`;
                        } else if (line.startsWith('-')) {
                            return `<div class="exercise-row">${line}</div>`;
                        } else if (line.trim()) {
                            return `<p class="routine-note">${line}</p>`;
                        }
                        return '';
                    })
                    .join('\n');

                rutinaResultado.innerHTML = `
                    <div class="bloque">
                        <div class="routine-header">
                            <h2>Tu Rutina Personalizada</h2>
                            <p class="routine-info">Nivel: ${nivel} | Objetivo: ${objetivo}</p>
                        </div>
                        <div class="routine-content">
                            ${rutinaFormateada}
                        </div>
                    </div>
                `;

                // Extraer los días de entrenamiento y actualizar el calendario
                const trainingDays = extractTrainingDays(data.rutina);
                calendar.setTrainingDays(trainingDays);

            } catch (error) {
                console.error('Error:', error);
                rutinaResultado.innerHTML = `
                    <div class="error-message">
                        <p>Lo siento, hubo un error al generar la rutina. Por favor, intenta de nuevo.</p>
                        <p class="error-details">${error.message}</p>
                    </div>`;
            } finally {
                generarRutinaBtn.disabled = false;
            }
        });
    }

    function extractTrainingDays(rutina) {
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
});
