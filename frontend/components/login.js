document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            // Aquí irá la lógica de autenticación cuando implementemos el backend
            console.log('Iniciando sesión con:', { email, password });
            
            // Por ahora, redirigimos al usuario a la página principal
            window.location.href = '/asistente.html';
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            alert('Error al iniciar sesión. Por favor, intenta de nuevo.');
        }
    });
}); 