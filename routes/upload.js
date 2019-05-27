var express = require('express');

var fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();

var Usuario = require('../models/usuario');
var Trabajador = require('../models/trabajador');
var Grupo = require('../models/grupo');


// default options
app.use(fileUpload());


app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;


    // Tipos de colección 
    var tiposValidos = ['grupos', 'trabajadores', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de coleccion no es válida',
            errors: { message: 'Tipo de coleccion no es válida' }
        });
    }


    if (!req.files) {
        return res.status(500).json({
            ok: false,
            mensaje: 'No selecciono nada',
            errors: { message: 'Deben de seleccionar una imagen' }
        });
    }

    // Obtener nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // Solo estas extensiones aceptamos
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Exetension no valida',
            errors: { message: 'Las extensiones válidas son ' + extensionesValidas.join(',') }
        });
    }

    // Nombre de archivo personalizado
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

    // Mover el archivo del temporal a un path
    var path = `./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv(path, err => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }
        subirPorTipo(tipo, id, nombreArchivo, res);

    });


});


function subirPorTipo(tipo, id, nombreArchivo, res) {

    if (tipo === 'usuarios') {
        Usuario.findById(id, (err, usuario) => {

            if (!usuario) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Usuario no existe',
                    errors: { message: 'Usuario no existe' }
                });
            }
            var pathViejo = './uploads/usuarios/' + usuario.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }
            usuario.img = nombreArchivo;

            usuario.save((err, usuarioActualizado) => {
                usuarioActualizado.password = ':)';
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuario: usuarioActualizado
                });
            });
        });
    }
    if (tipo === 'trabajadores') {
        Trabajador.findById(id, (err, trabajador) => {

            if (!trabajador) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Trabajador no existe',
                    errors: { message: 'Trabajador no existe' }
                });
            }

            var pathViejo = './uploads/trabajadores/' + trabajador.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }
            trabajador.img = nombreArchivo;

            trabajador.save((err, medicoActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de trabajador actualizada',
                    trabajador: medicoActualizado
                });
            });
        });
    }
    if (tipo === 'grupos') {
        Grupo.findById(id, (err, grupo) => {
            if (!grupo) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Grupo no existe',
                    errors: { message: 'Grupo no existe' }
                });
            }
            var pathViejo = './uploads/grupos/' + grupo.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }
            grupo.img = nombreArchivo;

            grupo.save((err, grupoActualizado) => {

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de grupo actualizada',
                    grupo: grupoActualizado
                });
            });
        });
    }

}

module.exports = app;