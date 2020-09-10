const express = require('express');
const app = express();
const cors = require('cors');
require('./lib/passport');
const session = require('express-session');
const mysqlStore = require('express-mysql-session');
const passport= require('passport');
const {database} = require('./keys');
// settings
app.set('port', process.env.PORT || 4000);
//midlewares
app.use(session({
    secret:'Jamester',
    resave:false,
    saveUninitialized:false,
    store: new mysqlStore(database)
 }));
 ////////////////////////////////////////////////////
app.use(passport.initialize()); // iniciando passport
app.use(passport.session()); // dandole a passport una session
app.use(cors());
app.use(express.json());

//routes---Store-Admin
app.use('/api/perfil', require('./routes/perfil'));
app.use('/api/categorias', require('./routes/categorias'));
app.use('/api/articulos', require('./routes/articulos'));
app.use('/api/clientes', require('./routes/clientes'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/store', require('./routes/store'));

//routes---Session
app.use('/api/authentications', require('./routes/aunthentications'));

module.exports = app;