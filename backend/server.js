const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();
const port = 3000;

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fitness_app', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error conectando a MongoDB:', err));

// Middleware básico
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Middleware de logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Rutas HTML específicas - TIENEN PRIORIDAD ABSOLUTA
const htmlRoutes = {
    '/mensajes.html': 'mensajes.html',
    '/mis-dietas.html': 'mis-dietas.html',
    '/asistente.html': 'asistente.html',
    '/dietas.html': 'dietas.html',
    '/entrenamientos.html': 'entrenamientos.html',
    '/progress.html': 'progress.html',
    '/nutricion.html': 'nutricion.html'
};

// Manejar rutas HTML antes que cualquier otro middleware
Object.entries(htmlRoutes).forEach(([route, file]) => {
    app.get(route, (req, res) => {
        console.log(`Sirviendo ${file}`);
        res.sendFile(path.join(__dirname, '../frontend/public', file));
    });
});

// Archivos estáticos después
app.use('/css', express.static(path.join(__dirname, '../frontend/public/css')));
app.use('/js', express.static(path.join(__dirname, '../frontend/public/js')));
app.use('/images', express.static(path.join(__dirname, '../frontend/public/images')));
app.use('/components', express.static(path.join(__dirname, '../frontend/components')));

// Rutas API
app.use('/api/auth', require('./routes/auth'));
app.use('/api/messages', require('./routes/messages'));

// Resto de archivos estáticos
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Configuración de OpenAI
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

// Endpoint para el chat
app.post('/api/chat', async (req, res) => {
    try {
        const { mensaje, tipo, lugar } = req.body;
        const prompt = `Actúa como un entrenador personal profesional...`;
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: prompt },
                { role: "user", content: mensaje }
            ],
            temperature: 0.7,
            max_tokens: 1000
        });

        res.json({
            respuesta: completion.data.choices[0].message.content,
            rutina: null
        });
    } catch (error) {
        console.error('Error en el chat:', error);
        res.status(500).json({
            error: 'Error al procesar el mensaje',
            detalles: error.message
        });
    }
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Algo salió mal!' });
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});