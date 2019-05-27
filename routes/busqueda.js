var express = require('express');

var app = express();

var Grupo = require('../models/grupo');
var Trabajadores = require('../models/trabajador');
var Usuarios = require('../models/usuario');

//=======================================
// Busqueda por coleccion
//=======================================

app.get('/coleccion/:tabla/:busqueda', (req, res) => {

    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regex = new RegExp(busqueda, 'i');

    var promesa;

    switch (tabla) {

        case 'usuarios':
            promesa = buscarUsuario(busqueda, regex);
            break;

        case 'trabajadores':
            promesa = buscarTrabajadores(busqueda, regex);
            break;


        case 'grupos':
            promesa = buscarGrupos(busqueda, regex);
            break;

        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busqueda sólo son: usuarios, trabajadores y grupos',
                error: { message: 'Tipo de tabla/coleccion no valido' }
            });

    }

    promesa.then(data => {

        res.status(200).json({
            ok: true,
            [tabla]: data
        });
    });
});



//=======================================
// Busqueda General
//=======================================


app.get('/todo/:busqueda', (req, res) => {

    var busqueda = req.params.busqueda;

    var regex = new RegExp(busqueda, 'i');



    Promise.all([
            buscarGrupos(busqueda, regex),
            buscarTrabajadores(busqueda, regex),
            buscarUsuario(busqueda, regex)
        ])
        .then(respuestas => {
            res.status(200).json({
                ok: true,
                grupos: respuestas[0],
                trabajadores: respuestas[1],
                usuarios: respuestas[2]
            });
        });

});



//=======================================
// Funciones de busqueda
//=======================================



function buscarGrupos(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Grupo.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .exec((err, grupos) => {
                if (err) {
                    reject('Error al cargar grupos', err);
                } else {
                    resolve(grupos);
                }
            });
    });
}

function buscarTrabajadores(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Trabajadores.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .populate('grupo')
            .exec((err, trabajadores) => {
                if (err) {
                    reject('Error al cargar trabajadores', err);
                } else {
                    resolve(trabajadores);
                }
            });

    });
}

function buscarUsuario(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Usuarios.find({}, 'nombre email role')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }
            });

    });
}


module.exports = app;