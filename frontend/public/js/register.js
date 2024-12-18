document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const form = document.getElementById('registerForm');

    // Requisitos de contraseña
    const requirements = {
        length: {
            regex: /.{8,}/,
            element: document.getElementById('length')
        },
        uppercase: {
            regex: /[A-Z]/,
            element: document.getElementById('uppercase')
        },
        lowercase: {
            regex: /[a-z]/,
            element: document.getElementById('lowercase')
        },
        number: {
            regex: /[0-9]/,
            element: document.getElementById('number')
        },
        special: {
            regex: /[!@#$%^&*]/,
            element: document.getElementById('special')
        }
    };

    // Validar contraseña en tiempo real
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        
        // Verificar cada requisito
        for (const [key, requirement] of Object.entries(requirements)) {
            const isValid = requirement.regex.test(password);
            requirement.element.classList.toggle('valid', isValid);
        }
    });

    // Validar formulario antes de enviar
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        let isValid = true;

        // Verificar todos los requisitos
        for (const [key, requirement] of Object.entries(requirements)) {
            if (!requirement.regex.test(password)) {
                isValid = false;
                break;
            }
        }

        // Verificar que las contraseñas coincidan
        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            isValid = false;
        }

        if (isValid) {
            // Aquí iría la lógica de registro con el backend
            console.log('Registro válido, procediendo con el registro');
            
            // Redirigir al usuario a la página del asistente
            window.location.href = '/asistente';
        }
    });
}); 