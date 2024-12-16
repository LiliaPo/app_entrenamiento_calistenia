document.addEventListener('DOMContentLoaded', () => {
    const entrenamientoCards = document.querySelectorAll('.entrenamiento-card');
    
    entrenamientoCards.forEach(card => {
        card.addEventListener('click', () => {
            const tipo = card.getAttribute('data-tipo');
            // Ahora todos los tipos de entrenamiento redirigen a la página de selección de lugar
            window.location.href = '/tipo-entrenamiento.html?tipo=' + tipo;
        });
    });
});
