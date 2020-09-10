module.exports={
    database: {
        host: process.env.SERV,
        user: process.env.DB_USER,
        password: process.env.PASSWORD,
        database: process.env.DB,
        acquireTimeout: process.env.TIME_OUT,
        multipleStatements: process.env.MULTIPLE_SQL,
        
    }
}