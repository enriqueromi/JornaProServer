// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
const config = require('./config/config');


// Inicializar variables
var app = express();


// Cors
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'x-www-form-urlencoded, Origin, Authorization, Content-Length, X-Requested-With, X-Forwarded-For, X-Forwarded-Proto, X-Forwarded-Port, X-Request-Start, X-Request-Id, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Request-Method', '*');
    res.header('Access-Control-Max-Age', '1728000');
    next();
});



// Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());



// Importar rutas
var appRoutes = require('./routes/app');
var usuariosRoutes = require('./routes/usuarios');
var loginRoutes = require('./routes/login');
var grupoRoutes = require('./routes/grupo');
var trabajadorRoutes = require('./routes/trabajador');
var busquedaRoutes = require('./routes/busqueda');
var imagenesRoutes = require('./routes/imagenes');
var uploadRoutes = require('./routes/upload');


// Conexión a la base de datos
mongoose.connection.openUri(config.db, (err, res) => {
    if (err) throw err;

    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');

    app.listen(config.port, () => {
        console.log(`API REST corriendo en http://localhost:${config.port}`);
    })
});

// Rutas
app.use('/usuarios', usuariosRoutes);
app.use('/grupo', grupoRoutes);
app.use('/trabajador', trabajadorRoutes);
app.use('/login', loginRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenesRoutes);

app.use('/', appRoutes);


// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express sever puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});