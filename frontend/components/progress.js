document.addEventListener('DOMContentLoaded', () => {
    // Configuración común para los gráficos
    const chartConfig = {
        responsive: true,
        maintainAspectRatio: false
    };

    // Inicializar gráfico de peso
    const weightCtx = document.getElementById('weightChart').getContext('2d');
    const weightData = {
        labels: getLastNDays(7),
        datasets: [{
            label: 'Peso (kg)',
            data: getWeightData(),
            borderColor: '#345845',
            backgroundColor: 'rgba(52, 88, 69, 0.1)',
            fill: true,
            tension: 0.4
        }]
    };
    new Chart(weightCtx, {
        type: 'line',
        data: weightData,
        options: {
            ...chartConfig,
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });

    // Inicializar gráfico de entrenamientos
    const workoutsCtx = document.getElementById('workoutsChart').getContext('2d');
    const workoutData = {
        labels: getLastNDays(30),
        datasets: [{
            label: 'Ejercicios Completados',
            data: getWorkoutData(),
            backgroundColor: 'rgba(52, 88, 69, 0.8)'
        }]
    };
    new Chart(workoutsCtx, {
        type: 'bar',
        data: workoutData,
        options: chartConfig
    });

    // Inicializar gráfico de dieta
    const dietCtx = document.getElementById('dietChart').getContext('2d');
    const dietData = {
        labels: ['Proteínas', 'Carbohidratos', 'Grasas'],
        datasets: [{
            label: 'Consumo Diario',
            data: getDietData(),
            backgroundColor: [
                'rgba(52, 152, 219, 0.8)',
                'rgba(46, 204, 113, 0.8)',
                'rgba(241, 196, 15, 0.8)'
            ]
        }]
    };
    new Chart(dietCtx, {
        type: 'doughnut',
        data: dietData,
        options: {
            ...chartConfig,
            cutout: '70%'
        }
    });

    // Actualizar estadísticas
    updateStats();
    updateIMC();
});

// Función para obtener los últimos N días
function getLastNDays(n) {
    const dates = [];
    for (let i = n - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dates.push(date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' }));
    }
    return dates;
}

// Función para obtener datos de peso
function getWeightData() {
    const weightHistory = JSON.parse(localStorage.getItem('weightHistory') || '[]');
    if (weightHistory.length === 0) {
        return Array(7).fill(null);
    }
    return weightHistory.slice(-7).map(entry => entry.weight);
}

// Función para obtener datos de entrenamientos
function getWorkoutData() {
    const workoutHistory = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
    const last30Days = Array(30).fill(0);
    
    workoutHistory.forEach(workout => {
        const date = new Date(workout.completedDate);
        const daysAgo = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
        if (daysAgo < 30) {
            last30Days[29 - daysAgo] = workout.days.reduce((total, day) => 
                total + day.exercises.filter(ex => ex.completed).length, 0);
        }
    });
    
    return last30Days;
}

// Función para obtener datos de dieta
function getDietData() {
    const dietHistory = JSON.parse(localStorage.getItem('dietHistory') || '[]');
    if (dietHistory.length === 0) {
        return [0, 0, 0];
    }
    const lastEntry = dietHistory[dietHistory.length - 1];
    return [
        lastEntry.proteins || 0,
        lastEntry.carbs || 0,
        lastEntry.fats || 0
    ];
}

// Función para actualizar estadísticas
function updateStats() {
    const workoutHistory = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
    const totalWorkouts = workoutHistory.length;
    const totalExercises = workoutHistory.reduce((total, workout) => 
        total + workout.days.reduce((dayTotal, day) => 
            dayTotal + day.exercises.filter(ex => ex.completed).length, 0), 0);

    document.getElementById('totalWorkouts').textContent = totalWorkouts;
    document.getElementById('totalExercises').textContent = totalExercises;

    // Simulación de datos de dieta para demostración
    document.getElementById('dietStreak').textContent = '0';
    document.getElementById('dietCompletion').textContent = '0%';
}

// Función para actualizar el IMC
function updateIMC() {
    const weightHistory = JSON.parse(localStorage.getItem('weightHistory') || '[]');
    const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    
    if (weightHistory.length > 0 && userProfile.height) {
        const lastWeight = weightHistory[weightHistory.length - 1].weight;
        const heightInMeters = userProfile.height / 100;
        const imc = lastWeight / (heightInMeters * heightInMeters);
        
        const marker = document.getElementById('imcMarker');
        const value = document.querySelector('.marker-value');
        
        value.textContent = imc.toFixed(1);
        
        // Posicionar el marcador
        let position = 0;
        if (imc < 18.5) {
            position = (imc / 18.5) * 25;
        } else if (imc < 25) {
            position = 25 + ((imc - 18.5) / 6.5) * 25;
        } else if (imc < 30) {
            position = 50 + ((imc - 25) / 5) * 25;
        } else {
            position = 75 + Math.min(((imc - 30) / 5) * 25, 25);
        }
        
        marker.style.left = `${position}%`;
    }
} 