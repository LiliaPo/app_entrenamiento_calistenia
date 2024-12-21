document.addEventListener('DOMContentLoaded', function() {
    cargarDietas();
    inicializarGrafico();
});

function cargarDietas() {
    const dietasGuardadas = JSON.parse(localStorage.getItem('dietas') || '[]');
    const dietasList = document.getElementById('dietas-list');
    
    if (dietasGuardadas.length === 0) {
        dietasList.innerHTML = '<p>No tienes dietas guardadas aún.</p>';
        return;
    }

    dietasList.innerHTML = dietasGuardadas.map((dieta, index) => `
        <div class="dieta-card">
            <h3>Dieta ${index + 1}</h3>
            <div class="dieta-content">
                ${dieta.contenido}
            </div>
            <div class="dieta-actions">
                <button onclick="eliminarDieta(${index})" class="btn-delete">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>
        </div>
    `).join('');
}

function eliminarDieta(index) {
    const dietasGuardadas = JSON.parse(localStorage.getItem('dietas') || '[]');
    dietasGuardadas.splice(index, 1);
    localStorage.setItem('dietas', JSON.stringify(dietasGuardadas));
    cargarDietas();
}

function inicializarGrafico() {
    const ctx = document.getElementById('evolucionChart').getContext('2d');
    const datos = obtenerDatosEvolucion();

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: datos.fechas,
            datasets: [{
                label: 'Progreso',
                data: datos.valores,
                borderColor: '#4CAF50',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        display: false
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            },
            layout: {
                padding: {
                    left: 10,
                    right: 10,
                    top: 10,
                    bottom: 10
                }
            }
        }
    });
}

function obtenerDatosEvolucion() {
    // Aquí podrías obtener datos reales del progreso del usuario
    return {
        fechas: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
        valores: [65, 64, 63.5, 63] // Ejemplo de progreso de peso
    };
}