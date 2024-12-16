document.addEventListener('DOMContentLoaded', () => {
    const generarRutinaBtn = document.getElementById('generar-rutina');
    const rutinaResultado = document.getElementById('rutina-resultado');
    const calendar = new Calendar(document.getElementById('calendar'));

    generarRutinaBtn.addEventListener('click', async () => {
        const objetivo = document.getElementById('objetivo').value;
        const nivel = document.getElementById('nivel').value;

        try {
            const response = await fetch('/generate-routine', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    tipo: objetivo,
                    lugar: 'gimnasio', // o podríamos añadir un selector para esto
                    mensaje: `Usuario de nivel ${nivel} buscando rutina de ${objetivo}`
                }),
            });

            if (!response.ok) {
                throw new Error('Error al generar la rutina');
            }

            const data = await response.json();
            
            // Formatear la rutina para mejor legibilidad
            const rutinaFormateada = data.rutina
                .replace(/Día \d+:/g, '\n\n$&\n')
                .replace(/(?:Ejercicios|Series|Repeticiones|Descanso):/g, '\n$&\n')
                .trim();

            rutinaResultado.innerHTML = `
                <div class="bloque">
                    ${rutinaFormateada}
                </div>
            `;

            // Extraer los días de entrenamiento y actualizar el calendario
            const trainingDays = extractTrainingDays(data.rutina);
            calendar.setTrainingDays(trainingDays);

        } catch (error) {
            console.error('Error:', error);
            rutinaResultado.innerHTML = '<p>Lo siento, hubo un error al generar la rutina. Por favor, intenta de nuevo.</p>';
        }
    });

    function extractTrainingDays(rutina) {
        const days = new Set();
        const today = new Date();
        const currentDay = today.getDate();
        const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
        
        // Determinar cuántos días de entrenamiento hay en la rutina
        const dayMatches = rutina.match(/Día \d+/g);
        const totalWorkoutDays = dayMatches ? dayMatches.length : 0;

        // Distribuir los entrenamientos con al menos un día de descanso entre ellos
        let nextWorkoutDay = currentDay;
        for (let i = 0; i < totalWorkoutDays; i++) {
            // Si el día siguiente supera el mes actual, reiniciar al principio del siguiente mes
            if (nextWorkoutDay > daysInMonth) {
                nextWorkoutDay = 1;
            }
            
            days.add(nextWorkoutDay);
            // Añadir 2 días para asegurar un día de descanso entre entrenamientos
            nextWorkoutDay += 2;
        }

        return days;
    }
});
