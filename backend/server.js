const express = require('express');
const path = require('path');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
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

        const prompt = `Actúa como un entrenador personal profesional. Estás ayudando a crear una rutina de ${tipo} para realizar en ${lugar}. 
        El usuario dice: "${mensaje}"
        
        Responde de manera amigable y profesional, haciendo preguntas relevantes si necesitas más información.
        Si el usuario ha proporcionado suficiente información, genera una rutina detallada y personalizada.
        
        Formato de respuesta:
        - Mantén un tono amigable y motivador
        - Si necesitas más información, haz preguntas específicas
        - Si generas una rutina, incluye:
          * Días de entrenamiento recomendados
          * Ejercicios específicos con series y repeticiones
          * Consejos de forma y técnica
          * Recomendaciones de descanso y recuperación`;

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
            rutina: null // Por ahora, la rutina se procesará más adelante
        });

    } catch (error) {
        console.error('Error en el chat:', error);
        res.status(500).json({
            error: 'Error al procesar el mensaje',
            detalles: error.message
        });
    }
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
}); 