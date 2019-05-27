var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();


var Grupo = require('../models/grupo');


//==========================================================
//  Obtener todos los grupos
//==========================================================

app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Grupo.find({})
        .skip(desde)
        // .limit(5)
        .populate('usuario', 'nombre email')
        .exec(
            (err, grupos) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando grupo ',
                        errors: err
                    });
                }

                Grupo.count({}, (req, conteo) => {
                    res.status(200).json({
                        ok: true,
                        grupos: grupos,
                        total: conteo
                    });

                });

            });
});

//==========================================================
//  Obtener grupos por ID
//==========================================================
app.get('/:id', (req, res) => {

    var id = req.params.id;

    Grupo.findById(id)
        .populate('usuario', 'nombre img email')
        .exec((err, grupo) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar grupo',
                    errors: err
                });
            }

            if (!grupo) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El grupo con el id ' + id + ' no existe',
                    errors: { message: 'No existe un grupo con ese ID' }
                });
            }
            res.status(200).json({ ok: true, grupo: grupo });
        });
});





//==========================================================
//  Actualizar grupos
//==========================================================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Grupo.findById(id, (err, grupo) => {



        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar grupo',
                errors: err
            });
        }
        if (!grupo) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El grupo con el id ' + id + ' no existe',
                errors: { message: 'No existe un grupo con ese ID' }
            });
        }
        grupo.nombre = body.nombre;
        grupo.usuario = req.usuario._id;

        grupo.save((err, grupoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar grupo',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                grupo: grupoGuardado
            });
        });
    });
});




//==========================================================
//  Crear un nuevo grupo
//==========================================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;


    var grupo = new Grupo({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    grupo.save((err, grupoGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear grupo ',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            grupo: grupoGuardado,
        });

    });



});


//==========================================================
//  Borrar un grupo por el id
//==========================================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Grupo.findByIdAndRemove(id, (err, grupoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar grupo ',
                errors: err
            });
        }
        if (!grupoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un grupo con ese id ',
                errors: { message: 'No existe un grupo con ese id ' }
            });
        }

        res.status(200).json({
            ok: true,
            grupo: grupoBorrado
        });
    })
})


exports = app;

module.exports = app;