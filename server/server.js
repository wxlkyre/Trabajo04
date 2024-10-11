const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// Conectar a la base de datos SQLite
const path = require('path');
const dbPath = path.join(__dirname, 'tareas.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err.message);
    } else {
        console.log('Conectado a la base de datos SQLite en:', dbPath);
    }
});


// Middleware
app.use(bodyParser.json());
app.use(express.static('public')); // Sirve archivos estáticos (HTML, CSS, JS)

// Crear tabla si no existe
db.run(`CREATE TABLE IF NOT EXISTS tareas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    descripcion TEXT NOT NULL
)`, (err) => {
    if (err) {
        console.error('Error al crear la tabla:', err.message);
    } else {
        console.log('Tabla tareas verificada o creada.');
    }
});

// Ruta para obtener todas las tareas
app.get('/tareas', (req, res) => {
    db.all('SELECT * FROM tareas', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ tareas: rows });
        }
    });
});

// Ruta para agregar una tarea
app.post('/tareas', (req, res) => {
    const { descripcion } = req.body;
    if (!descripcion) {
        return res.status(400).json({ error: 'La descripción es obligatoria' });
    }
    db.run('INSERT INTO tareas (descripcion) VALUES (?)', [descripcion], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID, descripcion });
    });
});

// Ruta para eliminar una tarea
app.delete('/tareas/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM tareas WHERE id = ?', id, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Tarea eliminada con éxito' });
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
