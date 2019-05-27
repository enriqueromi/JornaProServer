var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var trabajadorSchema = new Schema({
    nombre: { type: String, required: [true, 'El	nombre	es	necesario'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    grupo: { type: Schema.Types.ObjectId, ref: 'Grupo', required: [true, 'El	id	grupo	es	un	campo	obligatorio'] },
    estado: { type: Boolean, required: true }
});

module.exports = mongoose.model('Trabajador', trabajadorSchema);