import mongoose from 'mongoose';

// Esquema de Usuario
const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'El nombre es requerido'],
        trim: true
    },
    email: { 
        type: String, 
        required: [true, 'El email es requerido'], 
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingresa un email válido']
    },
    password: { 
        type: String, 
        required: [true, 'La contraseña es requerida'],
        minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
    },
    avatar: { 
        type: String, 
        default: '👤' 
    },
    role: { 
        type: String, 
        enum: {
            values: ['user', 'admin'],
            message: '{VALUE} no es un rol válido'
        },
        default: 'user' 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Esquema de Progreso
const progressSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    weight: { 
        type: Number, 
        required: [true, 'El peso es requerido'],
        min: [20, 'El peso mínimo es 20 kg'],
        max: [300, 'El peso máximo es 300 kg']
    },
    height: { 
        type: Number, 
        required: [true, 'La altura es requerida'],
        min: [100, 'La altura mínima es 100 cm'],
        max: [250, 'La altura máxima es 250 cm']
    },
    date: { 
        type: Date, 
        default: Date.now 
    },
    imc: { 
        type: Number,
        min: [10, 'IMC mínimo es 10'],
        max: [50, 'IMC máximo es 50']
    }
});

// Esquema de Entrenamiento
const workoutSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    name: { 
        type: String, 
        required: [true, 'El nombre del entrenamiento es requerido'],
        trim: true
    },
    type: { 
        type: String, 
        required: [true, 'El tipo de entrenamiento es requerido'],
        enum: {
            values: ['fuerza', 'cardio', 'flexibilidad', 'hiit', 'otro'],
            message: '{VALUE} no es un tipo de entrenamiento válido'
        }
    },
    exercises: [{
        name: { 
            type: String, 
            required: [true, 'El nombre del ejercicio es requerido'],
            trim: true
        },
        sets: { 
            type: Number,
            min: [1, 'Mínimo 1 serie'],
            max: [20, 'Máximo 20 series']
        },
        reps: { 
            type: Number,
            min: [1, 'Mínimo 1 repetición'],
            max: [100, 'Máximo 100 repeticiones']
        },
        completed: { 
            type: Boolean, 
            default: false 
        }
    }],
    startDate: { 
        type: Date, 
        required: true 
    },
    endDate: { 
        type: Date 
    },
    isActive: { 
        type: Boolean, 
        default: true 
    }
});

// Esquema de Dieta
const dietSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    name: { 
        type: String, 
        required: [true, 'El nombre de la dieta es requerido'],
        trim: true
    },
    meals: [{
        type: { 
            type: String, 
            required: [true, 'El tipo de comida es requerido'],
            enum: {
                values: ['desayuno', 'almuerzo', 'cena', 'snack'],
                message: '{VALUE} no es un tipo de comida válido'
            }
        },
        foods: [{
            name: { 
                type: String, 
                required: [true, 'El nombre del alimento es requerido'],
                trim: true
            },
            portion: { 
                type: String,
                required: [true, 'La porción es requerida']
            },
            calories: { 
                type: Number,
                min: [0, 'Las calorías no pueden ser negativas']
            }
        }]
    }],
    startDate: { 
        type: Date, 
        required: true 
    },
    endDate: { 
        type: Date 
    },
    isActive: { 
        type: Boolean, 
        default: true 
    }
});

// Esquema de Plan de Nutrición
const nutritionPlanSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    name: { 
        type: String, 
        required: [true, 'El nombre del plan es requerido'],
        trim: true
    },
    supplements: [{
        name: { 
            type: String, 
            required: [true, 'El nombre del suplemento es requerido'],
            trim: true
        },
        dosage: { 
            type: String,
            required: [true, 'La dosis es requerida']
        },
        timing: { 
            type: String,
            required: [true, 'El momento de toma es requerido']
        }
    }],
    recommendations: { 
        type: String,
        trim: true
    },
    startDate: { 
        type: Date, 
        required: true 
    },
    endDate: { 
        type: Date 
    },
    isActive: { 
        type: Boolean, 
        default: true 
    }
});

// Esquema de Mensajes
const messageSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    content: { 
        type: String, 
        required: [true, 'El contenido del mensaje es requerido'],
        trim: true,
        maxlength: [1000, 'El mensaje no puede exceder los 1000 caracteres']
    },
    images: [{ 
        type: String,
        validate: {
            validator: function(v) {
                return /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/i.test(v);
            },
            message: props => `${props.value} no es una URL de imagen válida`
        }
    }],
    likes: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }],
    hearts: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }],
    claps: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }],
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Esquema de Mensajes Directos
const directMessageSchema = new mongoose.Schema({
    senderId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    receiverId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    content: { 
        type: String, 
        required: [true, 'El contenido del mensaje es requerido'],
        trim: true,
        maxlength: [1000, 'El mensaje no puede exceder los 1000 caracteres']
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    read: { 
        type: Boolean, 
        default: false 
    }
});

// Crear los modelos
const User = mongoose.model('User', userSchema);
const Progress = mongoose.model('Progress', progressSchema);
const Workout = mongoose.model('Workout', workoutSchema);
const Diet = mongoose.model('Diet', dietSchema);
const NutritionPlan = mongoose.model('NutritionPlan', nutritionPlanSchema);
const Message = mongoose.model('Message', messageSchema);
const DirectMessage = mongoose.model('DirectMessage', directMessageSchema);

// Exportar los modelos
export {
    User,
    Progress,
    Workout,
    Diet,
    NutritionPlan,
    Message,
    DirectMessage
}; 