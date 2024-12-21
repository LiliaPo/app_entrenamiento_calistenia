document.addEventListener('DOMContentLoaded', () => {
    const messageText = document.getElementById('messageText');
    const imageUpload = document.getElementById('imageUpload');
    const imagePreview = document.getElementById('imagePreview');
    const postButton = document.getElementById('postMessage');
    const messageFeed = document.getElementById('messageFeed');

    // Cargar mensajes existentes
    loadMessages();

    // Manejar la vista previa de la imagen
    imageUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.innerHTML = `<img src="${e.target.result}" alt="Vista previa">`;
                imagePreview.classList.add('active');
            };
            reader.readAsDataURL(file);
        }
    });

    // Manejar la publicación de mensajes
    postButton.addEventListener('click', () => {
        const text = messageText.value.trim();
        const imageFile = imageUpload.files[0];

        if (!text && !imageFile) {
            alert('Por favor, escribe un mensaje o sube una imagen.');
            return;
        }

        if (imageFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                publishMessage(text, e.target.result);
            };
            reader.readAsDataURL(imageFile);
        } else {
            publishMessage(text);
        }
    });
});

// Función para cargar mensajes
function loadMessages() {
    const messages = JSON.parse(localStorage.getItem('communityMessages') || '[]');
    const messageFeed = document.getElementById('messageFeed');
    messageFeed.innerHTML = '';

    messages.reverse().forEach(message => {
        const messageElement = createMessageElement(message);
        messageFeed.appendChild(messageElement);
    });
}

// Función para publicar un mensaje
function publishMessage(text, imageData = null) {
    const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    const message = {
        id: Date.now(),
        userId: userProfile.id || 'anonymous',
        username: userProfile.username || 'Usuario Anónimo',
        avatar: userProfile.avatar || '/images/default-avatar.png',
        text: text,
        image: imageData,
        timestamp: new Date().toISOString(),
        likes: 0,
        comments: []
    };

    // Guardar el mensaje
    const messages = JSON.parse(localStorage.getItem('communityMessages') || '[]');
    messages.push(message);
    localStorage.setItem('communityMessages', JSON.stringify(messages));

    // Limpiar el formulario
    document.getElementById('messageText').value = '';
    document.getElementById('imageUpload').value = '';
    document.getElementById('imagePreview').innerHTML = '';
    document.getElementById('imagePreview').classList.remove('active');

    // Añadir el mensaje al feed
    const messageElement = createMessageElement(message);
    document.getElementById('messageFeed').insertBefore(messageElement, document.getElementById('messageFeed').firstChild);
}

// Función para crear el elemento HTML de un mensaje
function createMessageElement(message) {
    const div = document.createElement('div');
    div.className = 'post-card';
    div.innerHTML = `
        <div class="post-header">
            <img src="${message.avatar}" alt="${message.username}" class="post-avatar">
            <div class="post-user-info">
                <div class="post-username">${message.username}</div>
                <div class="post-time">${formatTimestamp(message.timestamp)}</div>
            </div>
        </div>
        <div class="post-content">${message.text}</div>
        ${message.image ? `<img src="${message.image}" alt="Imagen compartida" class="post-image">` : ''}
        <div class="post-actions-bar">
            <div class="post-action" onclick="toggleLike(${message.id})">
                <i class="far fa-heart"></i>
                <span>${message.likes}</span>
            </div>
            <div class="post-action">
                <i class="far fa-comment"></i>
                <span>${message.comments.length}</span>
            </div>
        </div>
    `;
    return div;
}

// Función para formatear la marca de tiempo
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffMinutes < 60) {
        return `Hace ${diffMinutes} minutos`;
    } else if (diffHours < 24) {
        return `Hace ${diffHours} horas`;
    } else if (diffDays < 7) {
        return `Hace ${diffDays} días`;
    } else {
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }
}

// Función para manejar los likes
function toggleLike(messageId) {
    const messages = JSON.parse(localStorage.getItem('communityMessages') || '[]');
    const messageIndex = messages.findIndex(m => m.id === messageId);
    
    if (messageIndex !== -1) {
        const message = messages[messageIndex];
        message.likes = (message.likes || 0) + 1;
        localStorage.setItem('communityMessages', JSON.stringify(messages));
        
        // Actualizar la UI
        const likeElement = event.currentTarget;
        const likeCount = likeElement.querySelector('span');
        likeCount.textContent = message.likes;
        likeElement.classList.add('liked');
        likeElement.querySelector('i').classList.remove('far');
        likeElement.querySelector('i').classList.add('fas');
    }
} 