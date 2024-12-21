// ... existing code ...

// Función para mostrar mensaje de guardado
function showWorkoutSaved() {
    const container = document.getElementById('rutina-resultado');
    container.innerHTML += `
        <div class="workout-saved">
            <i class="fas fa-check-circle"></i>
            <p>El entrenamiento se ha guardado correctamente.</p>
            <a href="/entrenamientos.html" class="auth-button login-button">Ver Mis Entrenamientos</a>
        </div>
    `;
}

// Función para procesar la rutina generada
function processGeneratedWorkout(rutina) {
    const objetivo = document.getElementById('objetivo').value;
    const nivel = document.getElementById('nivel').value;
    
    // Usar la función de workouts.js para guardar
    if (window.workoutManager && window.workoutManager.saveWorkout(rutina, objetivo, nivel)) {
        showWorkoutSaved();
    }
}

// ... rest of existing code ... 