require('dotenv').config()
const mongoose = require('mongoose')
//Connect to database
const URL = process.env.DATABASE_URL_ONLINE
//only nessesary with deprecation warning
const CONFIG = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
const db = mongoose.connection
mongoose.connect(URL, CONFIG)
db.on('open', () => { console.log(`Connected to DB - ${db.name} at ${db.host}:${db.port}`) })
    .on('close', () => { console.log('Closing DB') })
    .on('error', (error) => { console.log('There was an error: ', error) })

module.exports = mongoose