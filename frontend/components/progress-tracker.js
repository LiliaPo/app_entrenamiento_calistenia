// Configuración inicial de la gráfica
let weightChart;
const weightData = {
    labels: [],
    datasets: [{
        label: 'Peso (kg)',
        data: [],
        borderColor: '#345845',
        backgroundColor: 'rgba(52, 88, 69, 0.1)',
        tension: 0.4,
        fill: true
    }]
};

const chartConfig = {
    type: 'line',
    data: weightData,
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            }
        },
        scales: {
            y: {
                beginAtZero: false,
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    }
};

// Inicializar la gráfica cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('weightChart').getContext('2d');
    weightChart = new Chart(ctx, chartConfig);
    
    // Cargar datos guardados
    loadSavedData();
    
    // Agregar event listeners
    document.getElementById('save-progress').addEventListener('click', saveProgress);
    document.getElementById('weight').addEventListener('input', updateIMC);
    document.getElementById('height').addEventListener('input', updateIMC);
});

// Función para calcular el IMC
function calculateIMC(weight, height) {
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
}

// Función para actualizar el marcador de IMC
function updateIMC() {
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    
    if (weight && height) {
        const imc = calculateIMC(weight, height);
        const markerValue = document.querySelector('.marker-value');
        markerValue.textContent = imc.toFixed(1);
        
        // Posicionar el marcador
        const imcScale = document.querySelector('.imc-scale');
        const scaleWidth = imcScale.offsetWidth;
        let position;
        
        if (imc < 18.5) {
            position = (imc / 18.5) * 25; // 25% del ancho total
        } else if (imc < 25) {
            position = 25 + ((imc - 18.5) / 6.5) * 25; // 25-50%
        } else if (imc < 30) {
            position = 50 + ((imc - 25) / 5) * 25; // 50-75%
        } else {
            position = 75 + Math.min(((imc - 30) / 10) * 25, 25); // 75-100%
        }
        
        const marker = document.getElementById('imcMarker');
        marker.style.left = `${position}%`;
    }
}

// Función para guardar el progreso
function saveProgress() {
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    
    if (!weight) {
        alert('Por favor, ingresa tu peso');
        return;
    }
    
    const date = new Date();
    const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    
    // Guardar en localStorage
    let savedData = JSON.parse(localStorage.getItem('progressData') || '[]');
    savedData.push({ date: formattedDate, weight, height });
    localStorage.setItem('progressData', JSON.stringify(savedData));
    
    // Actualizar gráfica
    updateChart(savedData);
    
    // Limpiar campos
    document.getElementById('weight').value = '';
    document.getElementById('height').value = '';
    
    alert('Progreso guardado correctamente');
}

// Función para cargar datos guardados
function loadSavedData() {
    const savedData = JSON.parse(localStorage.getItem('progressData') || '[]');
    if (savedData.length > 0) {
        updateChart(savedData);
        
        // Mostrar último IMC
        const lastEntry = savedData[savedData.length - 1];
        if (lastEntry.height) {
            document.getElementById('height').value = lastEntry.height;
            document.getElementById('weight').value = lastEntry.weight;
            updateIMC();
        }
    }
}

// Función para actualizar la gráfica
function updateChart(data) {
    weightChart.data.labels = data.map(entry => entry.date);
    weightChart.data.datasets[0].data = data.map(entry => entry.weight);
    weightChart.update();
} 