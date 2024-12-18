import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';
import axios, { AxiosError } from 'axios';

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

interface GroqResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

app.post('/generate-routine', async (req, res) => {
  try {
    const { tipo, lugar, mensaje } = req.body;
    console.log('Generando rutina para:', { tipo, lugar, mensaje });
    
    const response = await axios.post<GroqResponse>(GROQ_API_URL, {
      model: "mixtral-8x7b-32768",
      messages: [
        {
          role: "system",
          content: `Eres un entrenador personal experto especializado en crear rutinas de ejercicio personalizadas.

IMPORTANTE: La rutina debe seguir EXACTAMENTE este formato para cada día:

Día 1: [Grupo Muscular]
- Calentamiento: [ejercicios de calentamiento]
- [Nombre del ejercicio] ([series] x [repeticiones]) - Peso: [peso recomendado]
- Descanso entre series: [tiempo]
[Notas sobre técnica]

Día 2: [Grupo Muscular]
[... continuar hasta Día 6]

Reglas estrictas:
1. DEBE ser una rutina de exactamente 6 días
2. Los días DEBEN estar numerados del 1 al 6, sin repeticiones
3. Cada día debe trabajar un grupo muscular diferente
4. Incluir calentamiento específico para cada día
5. Especificar peso recomendado para cada ejercicio
6. Incluir notas sobre técnica correcta
7. Adaptar los ejercicios para realizarse en ${lugar}
8. Enfocarse en el objetivo: ${tipo}
9. NO repetir días ni grupos musculares consecutivos
10. Incluir tiempo de descanso entre series

Distribución recomendada:
- Día 1: Pecho
- Día 2: Espalda
- Día 3: Piernas
- Día 4: Hombros
- Día 5: Brazos
- Día 6: Core y Cardio`
        },
        {
          role: "user",
          content: mensaje
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Respuesta recibida de Groq');
    const rutina = response.data.choices[0].message.content;
    
    // Formatear la rutina para mejor legibilidad
    const rutinaFormateada = rutina
      .replace(/Día \d+/g, '\n$&\n')
      .replace(/^- /gm, '\n- ')
      .trim();

    res.json({ rutina: rutinaFormateada });
  } catch (error) {
    console.error('Error detallado al generar la rutina:', error);
    
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      res.status(500).json({ 
        error: 'Error al generar la rutina',
        detalles: axiosError.response?.data || axiosError.message
      });
    } else {
      res.status(500).json({ 
        error: 'Error al generar la rutina',
        detalles: 'Error interno del servidor'
      });
    }
  }
});

app.post('/generate-diet', async (req, res) => {
  try {
    const { tipoDieta, duracion } = req.body;
    
    const response = await axios.post<GroqResponse>(GROQ_API_URL, {
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
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      res.status(500).json({ 
        error: 'Error al generar la dieta',
        detalles: axiosError.response?.data || axiosError.message
      });
    } else {
      res.status(500).json({ 
        error: 'Error al generar la dieta',
        detalles: 'Error interno del servidor'
      });
    }
  }
});

app.post('/generate-nutrition', async (req, res) => {
  try {
    const { tipoNutricion, objetivoNutricion } = req.body;
    
    const response = await axios.post<GroqResponse>(GROQ_API_URL, {
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
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      res.status(500).json({ 
        error: 'Error al generar el plan de nutrición',
        detalles: axiosError.response?.data || axiosError.message
      });
    } else {
      res.status(500).json({ 
        error: 'Error al generar el plan de nutrición',
        detalles: 'Error interno del servidor'
      });
    }
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
