document.addEventListener('DOMContentLoaded', () => {
    const userAvatar = document.getElementById('userAvatar');
    const userMenu = document.getElementById('userMenu');
    const userProfileForm = document.getElementById('userProfileForm');
    const avatarOptions = document.querySelectorAll('.avatar-option');

    // Cargar datos del usuario si existen
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    if (userData.avatar) {
        userAvatar.innerHTML = userData.avatar;
        userAvatar.style.display = 'flex';
        userAvatar.style.alignItems = 'center';
        userAvatar.style.justifyContent = 'center';
        userAvatar.style.fontSize = '1.8em';
    }

    // Mostrar/ocultar menú de usuario
    userAvatar.addEventListener('click', () => {
        userMenu.classList.toggle('active');
        if (userMenu.classList.contains('active')) {
            loadUserData();
        }
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!userMenu.contains(e.target) && !userAvatar.contains(e.target)) {
            userMenu.classList.remove('active');
        }
    });

    // Selección de avatar
    avatarOptions.forEach(option => {
        option.addEventListener('click', () => {
            avatarOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            userAvatar.innerHTML = option.dataset.avatar;
            userAvatar.style.display = 'flex';
            userAvatar.style.alignItems = 'center';
            userAvatar.style.justifyContent = 'center';
            userAvatar.style.fontSize = '1.8em';
        });
    });

    // Guardar datos del perfil
    userProfileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const userData = {
            name: document.getElementById('userName').value,
            email: document.getElementById('userEmail').value,
            phone: document.getElementById('userPhone').value,
            height: document.getElementById('userHeight').value,
            weight: document.getElementById('userWeight').value,
            age: document.getElementById('userAge').value,
            avatar: document.querySelector('.avatar-option.selected')?.dataset.avatar || 'default-avatar'
        };

        localStorage.setItem('userData', JSON.stringify(userData));
        userMenu.classList.remove('active');
        
        // Mostrar mensaje de éxito
        alert('Perfil guardado correctamente');
    });

    function loadUserData() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        // Rellenar formulario con datos guardados
        document.getElementById('userName').value = userData.name || '';
        document.getElementById('userEmail').value = userData.email || '';
        document.getElementById('userPhone').value = userData.phone || '';
        document.getElementById('userHeight').value = userData.height || '';
        document.getElementById('userWeight').value = userData.weight || '';
        document.getElementById('userAge').value = userData.age || '';

        // Seleccionar avatar guardado
        if (userData.avatar) {
            const savedAvatar = document.querySelector(`[data-avatar="${userData.avatar}"]`);
            if (savedAvatar) {
                avatarOptions.forEach(opt => opt.classList.remove('selected'));
                savedAvatar.classList.add('selected');
            }
        }
    }
}); 