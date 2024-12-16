document.addEventListener('DOMContentLoaded', () => {
    const generarNutricionBtn = document.getElementById('generar-nutricion');
    const tipoNutricionSelect = document.getElementById('tipo-nutricion');
    const objetivoNutricionSelect = document.getElementById('objetivo-nutricion');
    const nutricionResultado = document.getElementById('nutricion-resultado');

    generarNutricionBtn.addEventListener('click', async () => {
        const tipoNutricion = tipoNutricionSelect.options[tipoNutricionSelect.selectedIndex].text;
        const objetivoNutricion = objetivoNutricionSelect.options[objetivoNutricionSelect.selectedIndex].text;
        
        try {
            const response = await fetch('/generate-nutrition', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tipoNutricion, objetivoNutricion }),
            });

            if (!response.ok) {
                throw new Error('Error al generar el plan de nutrición');
            }

            const data = await response.json();
            
            // Formatear el plan de nutrición
            const nutricionFormateada = data.nutricion
                .replace(/Sección \d+:/g, '\n\n$&\n')
                .replace(/(?:Alimentos|Suplementos|Timing|Recomendaciones):/g, '\n$&\n')
                .trim();

            nutricionResultado.innerHTML = `
                <h2>Tu plan de nutrición deportiva para ${tipoNutricion}:</h2>
                <div class="bloque">
                    ${nutricionFormateada}
                </div>
            `;
        } catch (error) {
            console.error('Error:', error);
            nutricionResultado.innerHTML = '<p>Lo siento, hubo un error al generar el plan de nutrición. Por favor, intenta de nuevo.</p>';
        }
    });
}); 