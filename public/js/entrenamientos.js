document.addEventListener('DOMContentLoaded', () => {
    const entrenamientoCards = document.querySelectorAll('.entrenamiento-card');
    
    entrenamientoCards.forEach(card => {
        card.addEventListener('click', () => {
            const tipo = card.getAttribute('data-tipo');
            window.location.href = '/tipo-entrenamiento.html?tipo=' + tipo;
        });
    });
}); 