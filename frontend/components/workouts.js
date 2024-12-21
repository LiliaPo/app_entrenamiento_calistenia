// Gestor de entrenamientos
const WorkoutManager = {
    // Guardar un nuevo entrenamiento
    saveWorkout: function(rutina, tipo, nivel) {
        const workout = {
            type: tipo,
            level: nivel,
            days: [],
            startDate: new Date().toISOString(),
            completed: false
        };

        // Convertir la rutina de texto a estructura de datos
        const days = rutina.split('Día').filter(day => day.trim());
        days.forEach(dayText => {
            const exercises = [];
            const lines = dayText.split('\n').filter(line => line.trim());
            
            let currentExercise = null;
            lines.forEach(line => {
                if (line.includes('series') || line.includes('repeticiones')) {
                    const name = currentExercise;
                    const [sets, reps] = this.extractSetsAndReps(line);
                    exercises.push({
                        name: name,
                        sets: sets,
                        reps: reps,
                        completed: false
                    });
                } else if (line.trim() && !line.includes('Día')) {
                    currentExercise = line.trim();
                }
            });

            if (exercises.length > 0) {
                workout.days.push({
                    exercises: exercises
                });
            }
        });

        localStorage.setItem('currentWorkout', JSON.stringify(workout));
        return true;
    },

    // Extraer series y repeticiones del texto
    extractSetsAndReps: function(text) {
        const setsMatch = text.match(/(\d+)\s*series/);
        const repsMatch = text.match(/(\d+)\s*repeticiones/);
        
        return [
            setsMatch ? parseInt(setsMatch[1]) : 3,
            repsMatch ? parseInt(repsMatch[1]) : 12
        ];
    },

    // Cargar el entrenamiento actual
    loadCurrentWorkout: function() {
        const workout = localStorage.getItem('currentWorkout');
        if (workout) {
            const workoutData = JSON.parse(workout);
            this.displayWorkout(workoutData);
            this.updateProgress(workoutData);
        } else {
            document.getElementById('current-workout').innerHTML = `
                <div class="no-workout">
                    <p>No tienes ningún entrenamiento activo.</p>
                    <p>Ve al asistente para crear uno nuevo.</p>
                    <a href="/asistente.html" class="auth-button login-button">Crear Entrenamiento</a>
                </div>
            `;
        }
    },

    // Mostrar el entrenamiento en la interfaz
    displayWorkout: function(workout) {
        const container = document.getElementById('current-workout');
        let html = '';

        workout.days.forEach((day, index) => {
            html += `
                <div class="workout-day">
                    <h3>Día ${index + 1}</h3>
                    <div class="exercises">
                        ${day.exercises.map((exercise, exIndex) => `
                            <div class="exercise-item" data-day="${index}" data-exercise="${exIndex}">
                                <div class="exercise-checkbox ${exercise.completed ? 'completed' : ''}" 
                                     onclick="WorkoutManager.toggleExercise(${index}, ${exIndex})">
                                    ${exercise.completed ? '<i class="fas fa-check"></i>' : ''}
                                </div>
                                <div class="exercise-details">
                                    <div class="exercise-name">${exercise.name}</div>
                                    <div class="exercise-info">${exercise.sets} series x ${exercise.reps} repeticiones</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        });

        html += `
            <div class="workout-progress">
                <h4>Progreso Total</h4>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${this.calculateProgress(workout)}%"></div>
                </div>
            </div>
        `;

        container.innerHTML = html;
    },

    // Marcar/desmarcar ejercicios
    toggleExercise: function(dayIndex, exerciseIndex) {
        const workout = JSON.parse(localStorage.getItem('currentWorkout'));
        workout.days[dayIndex].exercises[exerciseIndex].completed = 
            !workout.days[dayIndex].exercises[exerciseIndex].completed;
        
        localStorage.setItem('currentWorkout', JSON.stringify(workout));
        this.displayWorkout(workout);
        this.updateProgress(workout);
        this.checkWorkoutCompletion(workout);
    },

    // Calcular el progreso total
    calculateProgress: function(workout) {
        let total = 0;
        let completed = 0;

        workout.days.forEach(day => {
            day.exercises.forEach(exercise => {
                total++;
                if (exercise.completed) completed++;
            });
        });

        return (completed / total) * 100;
    },

    // Actualizar el progreso
    updateProgress: function(workout) {
        const progress = this.calculateProgress(workout);
        if (progress === 100) {
            this.showWorkoutComplete();
        }
    },

    // Mostrar mensaje de entrenamiento completado
    showWorkoutComplete: function() {
        const container = document.getElementById('current-workout');
        container.innerHTML += `
            <div class="workout-complete">
                <i class="fas fa-trophy"></i>
                <h3>¡Felicidades! Has completado tu entrenamiento</h3>
                <p>Puedes crear un nuevo entrenamiento o revisar tu progreso</p>
                <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 1rem;">
                    <a href="/asistente.html" class="auth-button login-button">Nuevo Entrenamiento</a>
                    <a href="/progress.html" class="auth-button login-button">Ver Progreso</a>
                </div>
            </div>
        `;
        
        this.saveToHistory();
    },

    // Guardar en el historial
    saveToHistory: function() {
        const workout = JSON.parse(localStorage.getItem('currentWorkout'));
        const history = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
        
        workout.completedDate = new Date().toISOString();
        history.push(workout);
        
        localStorage.setItem('workoutHistory', JSON.stringify(history));
        localStorage.removeItem('currentWorkout');
        
        this.displayWorkoutHistory();
    },

    // Mostrar el historial
    displayWorkoutHistory: function() {
        const history = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
        const container = document.getElementById('completed-workouts');
        
        if (history.length === 0) {
            container.innerHTML = '<p>Aún no has completado ningún entrenamiento.</p>';
            return;
        }

        let html = '';
        history.reverse().forEach(workout => {
            const date = new Date(workout.completedDate).toLocaleDateString('es-ES');
            html += `
                <div class="history-card">
                    <div class="history-date">${date}</div>
                    <div class="history-title">${workout.type || 'Entrenamiento Personalizado'}</div>
                    <div class="history-stats">
                        <span>${workout.days.length} días</span>
                        <span>${this.countTotalExercises(workout)} ejercicios</span>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    },

    // Contar ejercicios totales
    countTotalExercises: function(workout) {
        return workout.days.reduce((total, day) => total + day.exercises.length, 0);
    },

    // Verificar si el entrenamiento está completo
    checkWorkoutCompletion: function(workout) {
        const progress = this.calculateProgress(workout);
        if (progress === 100) {
            this.showWorkoutComplete();
        }
    },

    // Inicializar
    init: function() {
        this.loadCurrentWorkout();
        this.displayWorkoutHistory();
    }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    WorkoutManager.init();
}); 