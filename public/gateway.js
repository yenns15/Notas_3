const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const fetch = require('node-fetch');
const mongoose = require('mongoose');
const { specs, swaggerUi } = require('./swagger-config');

const app = express();
const port = 4000;

app.use(bodyParser.json());


mongoose.connect('mongodb+srv://vrodriguezv:Valentina123@cluster0.knlvx22.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
});


const Note = mongoose.model('Note', {
    title: String,
    content: String,
    createdAt: Date
});

app.post('/auth/signup', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Enviar la solicitud al backend de Firebase
        const firebaseResponse = await fetch('http://localhost:5500/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const firebaseData = await firebaseResponse.json();

        // Devolver la respuesta del backend de Firebase al cliente
        res.json(firebaseData);
    } catch (error) {
        console.error('Error en el registro de usuario:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Ruta para manejar el inicio de sesión de usuarios existentes
app.post('/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Enviar la solicitud al backend de Firebase
        const firebaseResponse = await fetch('http://localhost:5500/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const firebaseData = await firebaseResponse.json();

        // Devolver la respuesta del backend de Firebase al cliente
        res.json(firebaseData);
    } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

app.post('/api/notes', async (req, res) => {
    try {
        const { title, content } = req.body;
        const newNote = new Note({ title, content, createdAt: new Date() });
        await newNote.save();
        res.status(201).json(newNote);
    } catch (error) {
        console.error('Error al agregar nota:', error);
        res.status(500).json({ error: 'Error interno del servidor al agregar nota' });
    }
});

// Ruta para obtener todas las notas
app.get('/api/notes', async (req, res) => {
    try {
        const notes = await Note.find();
        res.json(notes);
    } catch (error) {
        console.error('Error al obtener notas:', error);
        res.status(500).json({ error: 'Error interno del servidor al obtener notas' });
    }
});

// Ruta para eliminar una nota por su ID
app.delete('/api/notes/:_id', async (req, res) => {
    try {
        const { _id } = req.params;
        await Note.findByIdAndDelete(_id);
        res.json({ success: true });
    } catch (error) {
        console.error('Error al eliminar nota:', error);
        res.status(500).json({ error: 'Error interno del servidor al eliminar nota' });
    }
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Crear el servidor HTTP
const server = http.createServer(app);

// Iniciar el servidor en el puerto especificado
server.listen(port, () => {
    console.log(`API Gateway corriendo en http://localhost:${port}`);
});
