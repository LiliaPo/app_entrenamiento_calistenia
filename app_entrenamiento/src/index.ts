import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.post('/generate-routine', async (req, res) => {
  try {
    const { objetivo } = req.body;
    
    const response = await axios.post(GROQ_API_URL, {
      model: "mixtral-8x7b-32768",
      messages: [
        {
          role: "system",
          content: "Eres un asistente de entrenamiento experto. Proporciona rutinas de ejercicios personalizadas basadas en el objetivo del usuario."
        },
        {
          role: "user",
          content: `Genera una rutina de ejercicios para ${objetivo}.`
        }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const rutina = response.data.choices[0].message.content;
    res.json({ rutina });
  } catch (error) {
    console.error('Error al generar la rutina:', error);
    res.status(500).json({ error: 'Error al generar la rutina' });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
