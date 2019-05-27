var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();


var Trabajador = require('../models/trabajador');


//==========================================================
//  Obtener todos los trabajadores
//==========================================================

app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Trabajador.find({})
        .skip(desde)
        // .limit(5)
        .populate('usuario', 'nombre email')
        .populate('grupo')
        .exec(

            (err, trabajadores) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando trabajador ',
                        errors: err
                    });
                }

                Trabajador.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        trabajadores: trabajadores,
                        total: conteo
                    });
                });

            });
});

//==========================================================
//  Obtener trabajador estado
//==========================================================

app.get('/estado/:estado', (req, res) => {
        var estado = req.params.estado;

        Trabajador.find({ estado: estado }, (err, resp) => {})
            .populate('usuario', 'nombre email img estado')
            .populate('grupo')
            .exec((err, trabajador) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al buscar trabajador',
                        errors: err
                    });
                }
                if (!trabajador) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'El trabajador con el id ' + id + ' no existe',
                        errors: { message: 'No existe un trabajador con ese ID' }
                    });
                }
                res.status(200).json({
                    ok: true,
                    trabajador: trabajador
                });
            })


    })
    //==========================================================
    //  Obtener trabajador grupo
    //==========================================================

app.get('/grupos/:grupo', (req, res) => {
    var grupo = req.params.grupo;

    Trabajador.find({ grupo: grupo }, (err, resp) => {})

    .populate('grupo')
        .exec((err, trabajador) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar trabajador',
                    errors: err
                });
            }
            if (!trabajador) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El trabajador con el id ' + id + ' no existe',
                    errors: { message: 'No existe un trabajador con ese ID' }
                });
            }
            if (trabajador.length > 0) {
                return res.status(200).json({
                    ok: true,
                    casa: trabajador[0].grupo.nombre,
                    contador: trabajador.length
                });
            }
            // res.status(200).json({
            //     ok: false,

            // });
        });
});


//==========================================================
//  Obtener trabajador
//==========================================================

app.get('/:id', (req, res) => {
    var id = req.params.id;

    Trabajador.findById(id)
        .populate('usuario', 'nombre email img estado')
        .populate('grupo')
        .exec((err, trabajador) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar trabajador',
                    errors: err
                });
            }
            if (!trabajador) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El trabajador con el id ' + id + ' no existe',
                    errors: { message: 'No existe un trabajador con ese ID' }
                });
            }
            res.status(200).json({
                ok: true,
                trabajador: trabajador
            });
        })

})

//==========================================================
//  Actualizar trabajadores
//==========================================================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Trabajador.findById(id, (err, trabajador) => {



        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar trabajador',
                errors: err
            });
        }
        if (!trabajador) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El trabajador con el id ' + id + ' no existe',
                errors: { message: 'No existe un trabajador con ese ID' }
            });
        }
        trabajador.nombre = body.nombre;
        trabajador.usuario = req.usuario._id;
        trabajador.grupo = body.grupo;
        trabajador.estado = body.estado;

        trabajador.save((err, trabajadorGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar trabajador',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                trabajador: trabajadorGuardado
            });
        });
    });
});




//==========================================================
//  Crear un nuevo trabajador
//==========================================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;


    var trabajador = new Trabajador({
        nombre: body.nombre,
        usuario: req.usuario._id,
        grupo: body.grupo,

    });
    trabajador.estado = false;

    trabajador.save((err, trabajadorGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear trabajador ',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            trabajador: trabajadorGuardado,
        });

    });



});


//==========================================================
//  Borrar un trabajador por el id
//==========================================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Trabajador.findByIdAndRemove(id, (err, trabajadorBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar trabajador ',
                errors: err
            });
        }
        if (!trabajadorBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un trabajador con ese id ',
                errors: { message: 'No existe un trabajador con ese id ' }
            });
        }

        res.status(200).json({
            ok: true,
            trabajador: trabajadorBorrado
        });
    })
})




module.exports = app;