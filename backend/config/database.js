import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        
        console.log(`MongoDB conectado: ${conn.connection.host}`);
        
        // Manejadores de eventos de conexión
        mongoose.connection.on('error', err => {
            console.error(`Error de conexión MongoDB: ${err}`);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('MongoDB desconectado');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('MongoDB reconectado');
        });

    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB; 