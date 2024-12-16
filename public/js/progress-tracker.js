document.addEventListener('DOMContentLoaded', () => {
    const weightInput = document.getElementById('weight');
    const heightInput = document.getElementById('height');
    const saveButton = document.getElementById('save-progress');
    const weightCtx = document.getElementById('weightChart').getContext('2d');
    const imcMarker = document.getElementById('imcMarker');
    
    // Cargar datos guardados
    let progressData = JSON.parse(localStorage.getItem('progressData')) || [];
    
    // Actualizar marcador IMC
    function updateIMCMarker(imc) {
        const markerValue = imcMarker.querySelector('.marker-value');
        markerValue.textContent = imc.toFixed(1);
        
        // Calcular posición del marcador (en porcentaje)
        let position;
        if (imc < 18.5) {
            position = (imc / 18.5) * 25; // 25% del ancho total
        } else if (imc < 25) {
            position = 25 + ((imc - 18.5) / 6.5) * 25;
        } else if (imc < 30) {
            position = 50 + ((imc - 25) / 5) * 25;
        } else {
            position = 75 + Math.min(((imc - 30) / 10) * 25, 25);
        }
        
        imcMarker.style.left = `${position}%`;
    }
    
    // Configurar el gráfico de peso
    const weightChart = new Chart(weightCtx, {
        type: 'line',
        data: {
            labels: progressData.map(entry => new Date(entry.date).toLocaleDateString()),
            datasets: [{
                label: 'Peso (kg)',
                data: progressData.map(entry => entry.weight),
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Peso (kg)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Fecha'
                    }
                }
            }
        }
    });

    saveButton.addEventListener('click', () => {
        const weight = parseFloat(weightInput.value);
        const height = parseFloat(heightInput.value);
        
        if (!weight || !height) {
            alert('Por favor, introduce valores válidos para peso y altura.');
            return;
        }

        // Guardar nueva entrada
        const newEntry = {
            date: new Date().toISOString(),
            weight,
            height
        };

        progressData.push(newEntry);
        localStorage.setItem('progressData', JSON.stringify(progressData));

        // Actualizar gráfico de peso
        weightChart.data.labels = progressData.map(entry => new Date(entry.date).toLocaleDateString());
        weightChart.data.datasets[0].data = progressData.map(entry => entry.weight);
        weightChart.update();

        // Calcular IMC
        const imc = weight / Math.pow(height/100, 2);
        
        // Actualizar marcador IMC
        updateIMCMarker(imc);

        // Limpiar inputs
        weightInput.value = '';
        heightInput.value = '';

        // Calcular y mostrar IMC actual
        alert(`IMC actual: ${imc.toFixed(1)}\n\nReferencias IMC:
        - Bajo peso: < 18.5
        - Normal: 18.5 - 24.9
        - Sobrepeso: 25 - 29.9
        - Obesidad: ≥ 30`);
    });
}); 