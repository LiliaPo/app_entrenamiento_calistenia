import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';
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

app.get('/asistente.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/asistente.html'));
});

app.get('/dietas.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/dietas.html'));
});

app.get('/nutricion.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/nutricion.html'));
});

app.get('/tipo-entrenamiento.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/tipo-entrenamiento.html'));
});

app.get('/generar-rutina.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/generar-rutina.html'));
});

app.post('/generate-routine', async (req, res) => {
  try {
    const { tipo, lugar, mensaje } = req.body;
    
    // Verificar si el mensaje contiene datos personales (edad, género, etc.)
    const containsPersonalData = mensaje.toLowerCase().includes('años') || 
                               mensaje.toLowerCase().includes('mujer') || 
                               mensaje.toLowerCase().includes('hombre');
    
    const response = await axios.post(GROQ_API_URL, {
      model: "mixtral-8x7b-32768",
      messages: [
        {
          role: "system",
          content: containsPersonalData ? 
            `Eres un entrenador personal experto. El usuario ha proporcionado sus datos personales.
            Genera una rutina de ejercicios específica y detallada que incluya:
            - Rutina semanal completa
            - Ejercicios específicos para ${tipo}
            - Series y repeticiones
            - Tiempos de descanso
            - Duración de cada sesión
            - Recomendaciones específicas para su nivel
            La rutina debe ser realizable en ${lugar} y adaptada a sus características personales.` :
            "Eres un entrenador personal experto que recopila información inicial del usuario."
        },
        {
          role: "user",
          content: containsPersonalData ?
            `Datos del usuario: ${mensaje}
            Tipo de entrenamiento: ${tipo}
            Lugar: ${lugar}
            Genera una rutina completa y detallada.` :
            `¡Hola! Para ayudarte a crear una rutina de ${tipo} para realizar en ${lugar}, necesito conocer algunos detalles:
            1. ¿Cuál es tu edad, género y nivel de actividad física actual?
            2. ¿Tienes alguna lesión o condición médica que deba considerar?
            3. ¿Cuánto tiempo puedes dedicar a entrenar cada semana?
            4. ¿Hay algún tipo de ejercicio que prefieras o que desees evitar?
            
            Por favor, responde estas preguntas y te ayudaré a crear una rutina personalizada.`
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

app.post('/generate-diet', async (req, res) => {
  try {
    const { tipoDieta, duracion } = req.body;
    
    const response = await axios.post(GROQ_API_URL, {
      model: "mixtral-8x7b-32768",
      messages: [
        {
          role: "system",
          content: "Eres un nutricionista experto. Proporciona planes de dieta personalizados basados en los objetivos del usuario."
        },
        {
          role: "user",
          content: `Genera un plan de dieta para ${tipoDieta} con duración de ${duracion}.`
        }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const dieta = response.data.choices[0].message.content;
    res.json({ dieta });
  } catch (error) {
    console.error('Error al generar la dieta:', error);
    res.status(500).json({ error: 'Error al generar la dieta' });
  }
});

app.post('/generate-nutrition', async (req, res) => {
  try {
    const { tipoNutricion, objetivoNutricion } = req.body;
    
    const response = await axios.post(GROQ_API_URL, {
      model: "mixtral-8x7b-32768",
      messages: [
        {
          role: "system",
          content: "Eres un experto en nutrición deportiva. Proporciona planes de nutrición personalizados basados en los objetivos del usuario."
        },
        {
          role: "user",
          content: `Genera un plan de nutrición deportiva para ${tipoNutricion} enfocado en ${objetivoNutricion}.`
        }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const nutricion = response.data.choices[0].message.content;
    res.json({ nutricion });
  } catch (error) {
    console.error('Error al generar el plan de nutrición:', error);
    res.status(500).json({ error: 'Error al generar el plan de nutrición' });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
