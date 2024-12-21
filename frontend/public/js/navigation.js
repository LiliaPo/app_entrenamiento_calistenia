document.addEventListener('DOMContentLoaded', function() {
    const misDietasLink = document.getElementById('mis-dietas-link');
    
    if (misDietasLink) {
        misDietasLink.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Click en Mis dietas');
            window.location.href = '/mis-dietas.html';
        });
    }
}); 