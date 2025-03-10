import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';
import axios, { AxiosError } from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurar dotenv para cargar desde la carpeta backend
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const port = process.env.PORT || 3000;

// Configurar rutas para archivos estáticos
app.use(express.static(path.join(__dirname, '../../frontend/public')));
app.use('/images', express.static(path.join(__dirname, '../../frontend/public/images')));
app.use('/css', express.static(path.join(__dirname, '../../frontend/public/css')));
app.use('/js', express.static(path.join(__dirname, '../../frontend/public/js')));
app.use(express.json());

// Rutas principales
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/public/index.html'));
});

// Rutas de autenticación
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/public/login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/public/register.html'));
});

// Rutas de la aplicación
app.get('/entrenamientos', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/public/entrenamientos.html'));
});

app.get('/tipo-entrenamiento', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/public/tipo-entrenamiento.html'));
});

app.get('/generar-rutina', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/public/generar-rutina.html'));
});

app.get('/dietas', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/public/dietas.html'));
});

app.get('/nutricion', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/public/nutricion.html'));
});

app.get('/asistente', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/public/asistente.html'));
});

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

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
- [Nombre del ejercicio] ([series] x [repeticiones]) - Peso: [peso en kg] kg ([peso en lbs] lbs)
- Descanso entre series: [tiempo]
[Notas sobre técnica]

Día 2: [Grupo Muscular]
[... continuar hasta Día 6]

Reglas estrictas:
1. DEBE ser una rutina de exactamente 6 días
2. Los días DEBEN estar numerados del 1 al 6, sin repeticiones
3. Cada día debe trabajar un grupo muscular diferente
4. Incluir calentamiento específico para cada día
5. Especificar peso recomendado PRIMERO en kg y luego en lbs entre paréntesis
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
