document.addEventListener('DOMContentLoaded', () => {
    const generarDietaBtn = document.getElementById('generar-dieta');
    const tipoDietaSelect = document.getElementById('tipo-dieta');
    const duracionSelect = document.getElementById('duracion');
    const dietaResultado = document.getElementById('dieta-resultado');

    generarDietaBtn.addEventListener('click', async () => {
        const tipoDieta = tipoDietaSelect.options[tipoDietaSelect.selectedIndex].text;
        const duracion = duracionSelect.options[duracionSelect.selectedIndex].text;
        
        try {
            const response = await fetch('/generate-diet', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tipoDieta, duracion }),
            });

            if (!response.ok) {
                throw new Error('Error al generar la dieta');
            }

            const data = await response.json();
            
            // Formatear la dieta
            const dietaFormateada = data.dieta
                .replace(/Día \d+:/g, '\n\n$&\n')
                .replace(/(?:Desayuno|Almuerzo|Cena|Merienda):/g, '\n$&\n')
                .trim();

            // Guardar la dieta en localStorage
            const dietasGuardadas = JSON.parse(localStorage.getItem('dietas') || '[]');
            dietasGuardadas.push({
                tipo: tipoDieta,
                duracion: duracion,
                contenido: dietaFormateada,
                fecha: new Date().toISOString()
            });
            localStorage.setItem('dietas', JSON.stringify(dietasGuardadas));

            dietaResultado.innerHTML = `
                <h2>Tu plan de dieta para ${tipoDieta} - ${duracion}:</h2>
                <div class="bloque">
                    ${dietaFormateada}
                </div>
                <div class="dieta-actions">
                    <p class="success-message">¡Dieta guardada! Puedes verla en <a href="/mis-dietas.html">Mis Dietas</a></p>
                </div>
            `;
        } catch (error) {
            console.error('Error:', error);
            dietaResultado.innerHTML = '<p>Lo siento, hubo un error al generar la dieta. Por favor, intenta de nuevo.</p>';
        }
    });
}); 