module.exports = {
    port: process.env.PORT || 3001,
    db: process.env.MONGODB_URI || 'mongodb://localhost:27017/hospitalDB',
    SECRET_TOKEN: '@este-@es-un-seed-dificil'
}