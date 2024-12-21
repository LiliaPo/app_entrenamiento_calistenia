const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['like', 'heart', 'clap'],
        required: true
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
});

const messageSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: function() {
            return this.images.length === 0;
        }
    },
    images: [{
        type: String
    }],
    reactions: [reactionSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Método para añadir o quitar una reacción
messageSchema.methods.toggleReaction = function(userId, reactionType) {
    const reaction = this.reactions.find(r => r.type === reactionType);
    
    if (!reaction) {
        this.reactions.push({
            type: reactionType,
            users: [userId]
        });
    } else {
        const userIndex = reaction.users.indexOf(userId);
        if (userIndex === -1) {
            reaction.users.push(userId);
        } else {
            reaction.users.splice(userIndex, 1);
            if (reaction.users.length === 0) {
                this.reactions = this.reactions.filter(r => r.type !== reactionType);
            }
        }
    }
    return this.save();
};

const Message = mongoose.model('Message', messageSchema);

module.exports = Message; 