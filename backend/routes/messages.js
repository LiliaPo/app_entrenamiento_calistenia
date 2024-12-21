const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Message = require('../models/Message');
const DirectMessage = require('../models/DirectMessage');
const auth = require('../middleware/auth');

// Configurar multer para el almacenamiento de imágenes
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const dir = 'public/uploads/messages';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB límite
    },
    fileFilter: function(req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, gif)'));
    }
});

// Obtener todos los mensajes
router.get('/', auth, async (req, res) => {
    try {
        const messages = await Message.find()
            .populate('user', 'username avatar')
            .sort('-createdAt')
            .exec();
        
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Error al cargar los mensajes' });
    }
});

// Crear un nuevo mensaje
router.post('/', auth, upload.array('images', 5), async (req, res) => {
    try {
        const imageUrls = req.files ? req.files.map(file => `/uploads/messages/${file.filename}`) : [];
        
        const message = new Message({
            user: req.user._id,
            text: req.body.text,
            images: imageUrls
        });

        await message.save();
        
        const populatedMessage = await Message.findById(message._id)
            .populate('user', 'username avatar');
        
        res.status(201).json(populatedMessage);
    } catch (error) {
        res.status(400).json({ message: 'Error al crear el mensaje' });
    }
});

// Manejar reacciones
router.post('/:messageId/reactions', auth, async (req, res) => {
    try {
        const message = await Message.findById(req.params.messageId);
        if (!message) {
            return res.status(404).json({ message: 'Mensaje no encontrado' });
        }

        await message.toggleReaction(req.user._id, req.body.type);
        
        const updatedMessage = await Message.findById(message._id)
            .populate('user', 'username avatar');
        
        res.json(updatedMessage);
    } catch (error) {
        res.status(400).json({ message: 'Error al manejar la reacción' });
    }
});

// Enviar mensaje directo
router.post('/direct', auth, async (req, res) => {
    try {
        const directMessage = new DirectMessage({
            sender: req.user._id,
            recipient: req.body.recipientId,
            message: req.body.message
        });

        await directMessage.save();
        res.status(201).json({ message: 'Mensaje enviado correctamente' });
    } catch (error) {
        res.status(400).json({ message: 'Error al enviar el mensaje directo' });
    }
});

// Obtener mensajes directos
router.get('/direct/:userId', auth, async (req, res) => {
    try {
        const messages = await DirectMessage.find({
            $or: [
                { sender: req.user._id, recipient: req.params.userId },
                { sender: req.params.userId, recipient: req.user._id }
            ]
        })
        .populate('sender', 'username avatar')
        .sort('createdAt');

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Error al cargar los mensajes directos' });
    }
});

module.exports = router; 