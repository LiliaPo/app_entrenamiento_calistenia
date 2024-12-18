document.addEventListener('DOMContentLoaded', () => {
    const tipoCards = document.querySelectorAll('.tipo-card');
    const urlParams = new URLSearchParams(window.location.search);
    const tipo = urlParams.get('tipo');

    tipoCards.forEach(card => {
        card.addEventListener('click', () => {
            const lugar = card.getAttribute('data-lugar');
            window.location.href = `/generar-rutina.html?tipo=${tipo}&lugar=${lugar}`;
        });
    });
}); 