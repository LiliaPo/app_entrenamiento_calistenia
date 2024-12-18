document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }

        try {
            // Aquí irá la lógica de registro cuando implementemos el backend
            console.log('Registrando usuario:', { name, email, password });
            
            // Por ahora, redirigimos al usuario a la página de inicio de sesión
            window.location.href = '/login.html';
        } catch (error) {
            console.error('Error al registrar:', error);
            alert('Error al registrar. Por favor, intenta de nuevo.');
        }
    });
}); 