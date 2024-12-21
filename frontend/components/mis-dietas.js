document.addEventListener('DOMContentLoaded', function() {
    cargarDietas();
    cargarPlanesNutricion();
    inicializarGrafico();
    actualizarPlanesActivos();
});

function actualizarPlanesActivos() {
    // Verificar dieta activa
    const dietaActiva = JSON.parse(localStorage.getItem('dieta_activa') || 'null');
    const dietaActivaContainer = document.getElementById('dieta-activa');
    
    if (dietaActiva) {
        dietaActivaContainer.innerHTML = `
            <div class="plan-activo">
                <h3>${dietaActiva.tipo}</h3>
                <div class="plan-content">
                    ${dietaActiva.contenido}
                </div>
                <button onclick="desactivarDieta()" class="btn-delete">
                    <i class="fas fa-times"></i> Finalizar Dieta
                </button>
            </div>
        `;
    }

    // Verificar plan de nutrición activo
    const nutricionActiva = JSON.parse(localStorage.getItem('nutricion_activa') || 'null');
    const nutricionActivaContainer = document.getElementById('nutricion-activa');
    
    if (nutricionActiva) {
        nutricionActivaContainer.innerHTML = `
            <div class="plan-activo">
                <h3>${nutricionActiva.tipo}</h3>
                <div class="plan-content">
                    ${nutricionActiva.contenido}
                </div>
                <button onclick="desactivarNutricion()" class="btn-delete">
                    <i class="fas fa-times"></i> Finalizar Plan
                </button>
            </div>
        `;
    }
}

function cargarDietas() {
    const dietasGuardadas = JSON.parse(localStorage.getItem('dietas') || '[]');
    const dietasList = document.getElementById('dietas-list');
    
    if (dietasGuardadas.length === 0) {
        dietasList.innerHTML = '<p>No tienes dietas guardadas aún.</p>';
        return;
    }

    dietasList.innerHTML = dietasGuardadas.map((dieta, index) => `
        <div class="dieta-card">
            <h3>${dieta.tipo || 'Dieta ' + (index + 1)}</h3>
            <div class="dieta-content">
                ${dieta.contenido}
            </div>
            <div class="dieta-actions">
                <button onclick="activarDieta(${index})" class="btn-activate">
                    <i class="fas fa-play"></i> Activar
                </button>
                <button onclick="eliminarDieta(${index})" class="btn-delete">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>
        </div>
    `).join('');
}

function cargarPlanesNutricion() {
    const planesGuardados = JSON.parse(localStorage.getItem('planes_nutricion') || '[]');
    const nutricionList = document.getElementById('nutricion-list');
    
    if (planesGuardados.length === 0) {
        nutricionList.innerHTML = '<p>No tienes planes de nutrición guardados aún.</p>';
        return;
    }

    nutricionList.innerHTML = planesGuardados.map((plan, index) => `
        <div class="dieta-card">
            <h3>${plan.tipo || 'Plan ' + (index + 1)}</h3>
            <div class="dieta-content">
                ${plan.contenido}
            </div>
            <div class="dieta-actions">
                <button onclick="activarNutricion(${index})" class="btn-activate">
                    <i class="fas fa-play"></i> Activar
                </button>
                <button onclick="eliminarPlanNutricion(${index})" class="btn-delete">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>
        </div>
    `).join('');
}

function activarDieta(index) {
    const dietas = JSON.parse(localStorage.getItem('dietas') || '[]');
    localStorage.setItem('dieta_activa', JSON.stringify(dietas[index]));
    actualizarPlanesActivos();
}

function activarNutricion(index) {
    const planes = JSON.parse(localStorage.getItem('planes_nutricion') || '[]');
    localStorage.setItem('nutricion_activa', JSON.stringify(planes[index]));
    actualizarPlanesActivos();
}

function desactivarDieta() {
    localStorage.removeItem('dieta_activa');
    actualizarPlanesActivos();
}

function desactivarNutricion() {
    localStorage.removeItem('nutricion_activa');
    actualizarPlanesActivos();
}

function eliminarDieta(index) {
    const dietasGuardadas = JSON.parse(localStorage.getItem('dietas') || '[]');
    dietasGuardadas.splice(index, 1);
    localStorage.setItem('dietas', JSON.stringify(dietasGuardadas));
    cargarDietas();
}

function eliminarPlanNutricion(index) {
    const planesGuardados = JSON.parse(localStorage.getItem('planes_nutricion') || '[]');
    planesGuardados.splice(index, 1);
    localStorage.setItem('planes_nutricion', JSON.stringify(planesGuardados));
    cargarPlanesNutricion();
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
                borderColor: '#345845',
                backgroundColor: 'rgba(52, 88, 69, 0.1)',
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