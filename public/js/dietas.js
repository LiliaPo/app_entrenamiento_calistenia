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

            dietaResultado.innerHTML = `
                <h2>Tu plan de dieta para ${tipoDieta} - ${duracion}:</h2>
                <div class="bloque">
                    ${dietaFormateada}
                </div>
            `;
        } catch (error) {
            console.error('Error:', error);
            dietaResultado.innerHTML = '<p>Lo siento, hubo un error al generar la dieta. Por favor, intenta de nuevo.</p>';
        }
    });
}); 