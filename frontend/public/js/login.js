document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            // Aquí iría la lógica de autenticación con el backend
            // Por ahora simulamos un login exitoso
            console.log('Login exitoso');
            
            // Redirigir al usuario a la página del asistente
            window.location.href = '/asistente';
        } catch (error) {
            console.error('Error en el login:', error);
        }
    });
}); 